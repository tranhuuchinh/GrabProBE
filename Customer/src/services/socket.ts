import { Server, Socket } from 'socket.io'
import http from 'http'
import { publishToMediator } from './ChannelService/mediator'
import OrderModel from '~/models/OrderModel'

enum ClientStatus {
  IDLE = 'idle',
  BUSY = 'busy'
}

interface ClientInfo {
  socket: Socket
  status: ClientStatus
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
        status: ClientStatus.IDLE
      }

      this.connectedClients.set(socket.id, clientInfo)

      socket.on('customerClient', (message: any) => {
        console.log('Message from customer:', message)
        // Message là Object inform từ khách hàng gửi sang => Địa điểm khách hàng
        // 1. Tạo order ko tài xế
        const newOrderNoDriver = new OrderModel({
          username: 'john_doe',
          fullname: 'John Doe',
          phone: '123456789'
        })

        newOrderNoDriver.save()

        // 2. Publish qua cho Cordinator xử lí kiếm tài xế (data là địa điểm khách hàng)
        publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: 'FIND DRIVER' + message })
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

  emitMessage(clientId: string, channel: string, message: any) {
    const clientInfo = this.connectedClients.get(clientId)

    if (clientInfo) {
      clientInfo.socket.emit(channel, message)
    }
  }
}

export default SocketManager
