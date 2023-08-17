import { Server, Socket } from 'socket.io'
import http from 'http'
import { publishToMediator } from './DriverChannel/mediator'
import OrderModel from '~/models/OrderModel'

enum ClientStatus {
  IDLE = 'idle',
  BUSY = 'busy'
}

interface ClientInfo {
  socket: Socket
  status: ClientStatus
  idAccount: string
}

class SocketManager {
  private static instance: SocketManager
  private io: Server
  private connectedClients: Map<string, ClientInfo>

  private constructor(server: http.Server) {
    this.io = new Server(server, { cors: { origin: '*' } })
    this.connectedClients = new Map()

    this.io.on('connection', (socket: Socket) => {
      console.log('A client connected', socket.id)

      const clientInfo: ClientInfo = {
        socket,
        status: ClientStatus.IDLE,
        idAccount: ''
      }

      this.connectedClients.set(socket.id, clientInfo)

      socket.on('setID', (idFromClient: any) => {
        console.log('ID from driver:', idFromClient)
        this.connectedClients.set(socket.id, { socket, status: ClientStatus.IDLE, idAccount: idFromClient })
      })

      socket.on('driverClient', (message: any) => {
        console.log('Message from driver:', message)
        // Gửi tin nhắn cho client sau khi gán idAccount
        this.emitMessage('IdAccount', 'driverClient', 'Bố m trả lời nè')

        // 1. Tính toán khoảng cách ở dưới Client xong gửi lên cho Coordinator và kiểm tra <4km
        // publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: 'SEND DISTANCE' + message })
      })
      socket.on('acceptOrder', (inforDriver: any) => {
        // Update Driver for Order
        OrderModel.findByIdAndUpdate(inforDriver.idOrder, { idDriver: inforDriver.idUser }, { new: true })
          .then((updatedOrder) => {
            console.log(updatedOrder)

            //Sang Coordinate xóa stack có idOrder đấy đi
          })
          .catch((error) => {
            console.error('Error updating order:', error)
          })
      })
      socket.on('cancelOrder', (inforDriver: any) => {
        // 2. Hủy đơn
        // publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: 'CANCEL ORDER' })
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
