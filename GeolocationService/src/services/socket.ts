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

      socket.on('clientGeolocationResolved', async (message: any) => {
        console.log('Message from clientGeolocationResolved:', message)
        this.setClientStatus(socket.id, ClientStatus.IDLE)
        if (!message) return

        const elasticsearchService = ElasticsearchService.getInstance()
        const indexStart = await elasticsearchService.createIndex(message?.data?.addressStart)
        const indexEnd = await elasticsearchService.createIndex(message?.data?.addressEnd)
        if (indexStart != '') await elasticsearchService.addDocument(indexStart, message?.data?.geocodeStart)
        if (indexEnd != '') await elasticsearchService.addDocument(indexEnd, message?.data?.geocodeEnd)

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

  sendBroadcastGeolocaion(data: any): boolean {
    let check: boolean = false
    this.connectedClients.forEach((clientInfo) => {
      if (!check && clientInfo.status === ClientStatus.IDLE) {
        clientInfo.socket.emit('GEOLOCATION_CLIENT', data)
        clientInfo.status = ClientStatus.BUSY
        check = true
      }
    })
    return check
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
