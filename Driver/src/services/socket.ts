import { Server, Socket } from 'socket.io'
import http from 'http'
import { publishToMediator } from './DriverChannel/mediator'

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

      socket.on('driverClient', (message: any) => {
        console.log('Message from driver:', message)
        // 1. Tính toán khoảng cách ở dưới Client xong gửi lên cho Coordinator
        publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: 'SEND DISTANCE' + message })

        // 2. Hủy đơn
        publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: 'CANCEL ORDER' })
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