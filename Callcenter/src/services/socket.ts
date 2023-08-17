import { Server, Socket } from 'socket.io'
import http from 'http'
import { publishToMediator } from './CallCenterService/mediator'
import ElasticsearchService from './ElasticsearchService'
import UserFactory from './UserService/UserFactory'

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

      socket.on('customerBooking', async (message: any) => {
        console.log('Message from customerBooking:', message)
        // Check địa chỉ đã được định vị bằng Elastic-Search
        const elasticsearchService = ElasticsearchService.getInstance()
        const geocodeStart = await elasticsearchService.search(message.addressStart, '*')
        const geocodeEnd = await elasticsearchService.search(message.addressEnd, '*')
        if (geocodeStart.length) {
          message.geocodeStart = geocodeStart[0]._source
        }
        if (geocodeEnd.length) {
          message.geocodeEnd = geocodeEnd[0]._source
        }

        if (geocodeStart.length && geocodeEnd.length) {
          try {
            const user = await UserFactory.createUser(
              'hotline',
              '',
              message?.data?.phone,
              (Math.random() * 1000).toString(),
              message?.data?.name || ''
            )

            message.data.user = user

            publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: message.data, geolocation: message.geolocation })
          } catch (e) {
            console.log(e)
          }
          publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: message })
        } else {
          publishToMediator({ type: 'CUSTOMER_REQUESTED', data: message })
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
