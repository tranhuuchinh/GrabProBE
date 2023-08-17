import { Server, Socket } from 'socket.io'
import http from 'http'
import { publishToMediator } from './ChannelService/mediator'
import OrderModel from '~/models/OrderModel'
import mongoose from 'mongoose'
import LocationModel from '~/models/LocationModel'
import TypeTransportModel from '~/models/TypeTransportModel'

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

      socket.on('customerClient', async (inforCustomer: any) => {
        // inforCustomer là Object inform từ khách hàng gửi sang => Địa điểm khách hàng
        this.connectedClients.set(socket.id, { socket, status: ClientStatus.IDLE, idAccount: inforCustomer.idUser })

        try {
          // Tìm kiếm địa điểm từ lat và lng cho fromLocation
          const existingFromLocation = await LocationModel.findOne({
            latitude: inforCustomer.from.lat,
            altitude: inforCustomer.from.lng
          })

          let savedFromLocation

          // Nếu địa điểm đã tồn tại, sử dụng nó, nếu không, tạo mới
          if (existingFromLocation) {
            savedFromLocation = existingFromLocation
          } else {
            const newFromLocation = new LocationModel({
              address: inforCustomer.from.address,
              latitude: inforCustomer.from.lat,
              altitude: inforCustomer.from.lng
            })
            savedFromLocation = await newFromLocation.save()
          }

          // Tương tự, thực hiện với toLocation
          const existingToLocation = await LocationModel.findOne({
            latitude: inforCustomer.to.lat,
            altitude: inforCustomer.to.lng
          })

          let savedToLocation

          if (existingToLocation) {
            savedToLocation = existingToLocation
          } else {
            const newToLocation = new LocationModel({
              address: inforCustomer.to.address,
              latitude: inforCustomer.to.lat,
              altitude: inforCustomer.to.lng
            })
            savedToLocation = await newToLocation.save()
          }

          // Tiếp tục với việc tạo Order, tính toán totalPrice, và các bước khác
          try {
            const typeTransport = await TypeTransportModel.findOne({ name: inforCustomer.type })
            if (typeTransport) {
              const pricePerKm = typeTransport.priceperKm
              const distance = parseFloat(inforCustomer.distance)

              // Tính toán totalPrice dựa trên pricePerKm và distance
              const totalPrice = pricePerKm * distance

              const newOrderNoDriver = new OrderModel({
                idCustomer: new mongoose.Types.ObjectId(inforCustomer.idUser),
                from: savedFromLocation._id,
                to: savedToLocation._id,
                type: inforCustomer.type,
                totalPrice: totalPrice
              })
              const savedOrder = await newOrderNoDriver.save()

              // 2. Publish qua cho Cordinator xử lí kiếm tài xế (data là địa điểm khách hàng)
              const inforData = {
                idUser: inforCustomer.idUser,
                lat: inforCustomer.from.lat,
                lon: inforCustomer.from.lng,
                idOrder: savedOrder._id
              }

              publishToMediator({ type: 'COORDINATION_FIND_DRIVER', data: inforData })
            }
          } catch (error) {
            console.error('Error creating order:', error)
          }
        } catch (error) {
          console.error('Error saving locations:', error)
        }
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
}

export default SocketManager
