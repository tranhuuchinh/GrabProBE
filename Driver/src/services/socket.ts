import { Server, Socket } from 'socket.io'
import http from 'http'
import { publishToMediator } from './DriverChannel/mediator'
import OrderModel from '~/models/OrderModel'
import mongoose from 'mongoose'

enum ClientStatus {
  IDLE = 'idle',
  BUSY = 'busy'
}

interface ClientInfo {
  socket: Socket
  status: ClientStatus
  idAccount: string
  type: string
}

class SocketManager {
  private static instance: SocketManager
  private io: Server
  private connectedClients: Map<string, ClientInfo>
  private driverInfoByOrder: { [idOrder: string]: Array<any> } = {}

  private constructor(server: http.Server) {
    this.io = new Server(server, { cors: { origin: '*' } })
    this.connectedClients = new Map()

    this.io.on('connection', (socket: Socket) => {
      console.log('A client connected', socket.id)

      const clientInfo: ClientInfo = {
        socket,
        status: ClientStatus.IDLE,
        idAccount: '',
        type: ''
      }

      this.connectedClients.set(socket.id, clientInfo)

      socket.on('setID', (inforDriver: any) => {
        console.log(inforDriver)

        this.connectedClients.set(socket.id, {
          socket,
          status: ClientStatus.IDLE,
          idAccount: inforDriver.idAccount,
          type: inforDriver.type
        })
      })

      socket.on('driverClient', (inforDriver: any) => {
        console.log('Message from driver:', inforDriver)

        // Tính toán khoảng cách ở dưới Client xong gửi lên cho Coordinator và kiểm tra < 4km
        const { idDriver, idOrder, fromDri, toCus } = inforDriver

        if (!this.driverInfoByOrder[idOrder]) {
          this.driverInfoByOrder[idOrder] = []
        }

        this.driverInfoByOrder[idOrder].push({
          idDriver,
          from: fromDri,
          to: toCus
        })

        // Kiểm tra nếu có đủ số lượng tài xế (ví dụ 3 tài xế) thì gửi thông tin điều phối
        if (this.driverInfoByOrder[idOrder].length >= 1) {
          const coordinationData = {
            idOrder,
            drivers: this.driverInfoByOrder[idOrder]
          }

          // Gửi thông tin điều phối lên mediator
          publishToMediator({ type: 'COORDINATION_BOOK_REQUEST', data: coordinationData })

          // Sau khi gửi, bạn có thể xóa thông tin tài xế đã được gửi đi
          delete this.driverInfoByOrder[idOrder]
        }
      })
      socket.on('acceptOrder', (inforDriver: any) => {
        // Update Driver and status for Order
        OrderModel.findByIdAndUpdate(
          new mongoose.Types.ObjectId(inforDriver.idOrder),
          { idDriver: new mongoose.Types.ObjectId(inforDriver.idDriver), status: 1 },
          { new: true }
        )
          .then(() => {
            // Data gồm idDriver và idOrder
            // Sang Coordinate xóa stack có idOrder đấy đi
            // Push idUser của Driver qua Customer để nó nhận để render ra
            const object = {
              idDriver: inforDriver.idDriver,
              idCustomer: inforDriver.idCustomer,
              idOrder: inforDriver.idOrder
            }
            publishToMediator({ type: 'COORDINATION_ACCEPT_REQUEST', data: object })
            publishToMediator({ type: 'CUSTOMER_ACCEPT_REQUEST', data: object })
          })
          .catch((error) => {
            console.error('Error updating order:', error)
          })
      })
      socket.on('followDriver', (inforDriver: any) => {
        // 2. Theo dõi tài xế
        // Data là idCustomer, lat, lng của Driver
        publishToMediator({ type: 'CUSTOMER_FOLLOW_DRIVER', data: inforDriver })
      })
      socket.on('cancelOrder', (inforDriver: any) => {
        // 2. Hủy đơn
        // Data gồm idDriver và idOrder
        // Push sang Coordination để kiếm thằng khác
        publishToMediator({ type: 'COORDINATION_DENY_REQUEST', data: inforDriver })
      })

      socket.on('disconnect', () => {
        console.log('A client disconnected', socket.id)
        this.connectedClients.delete(socket.id)
      })
    })
  }

  static getInstance(server: http.Server): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(server)
    }
    return SocketManager.instance
  }

  sendBroadcastToClient(channel: string, data: any): void {
    this.connectedClients.forEach((clientInfo) => {
      clientInfo.socket.emit(channel, data)
    })
  }

  getSocketIOInstance(): Server {
    return this.io
  }

  emitMessage(idAccount: string, channel: string, message: any) {
    this.connectedClients.forEach((clientInfo) => {
      if (clientInfo.idAccount === idAccount) {
        clientInfo.socket.emit(channel, message)
      }
    })
  }

  sendBroadcastWithType(type: string, channel: string, message: any) {
    this.connectedClients.forEach((clientInfo) => {
      console.log(clientInfo.type)

      if (clientInfo.type === type) {
        console.log('1')

        clientInfo.socket.emit(channel, message)
      }
    })
  }

  getClientStatus(clientId: string): ClientStatus | undefined {
    const clientInfo = this.connectedClients.get(clientId)

    if (clientInfo) {
      return clientInfo.status
    }

    return undefined
  }

  setClientStatus(clientId: string, status: ClientStatus) {
    const clientInfo = this.connectedClients.get(clientId)

    if (clientInfo) {
      clientInfo.status = status
    }
  }
}

export default SocketManager
