/* eslint-disable no-useless-catch */
import { Server, Socket } from 'socket.io'
import http from 'http'
import { publishToMediator } from './CallCenterService/mediator'
import ElasticsearchService from './ElasticsearchService'
import UserFactory, { IUser } from './UserService/UserFactory'
import AccountModel from '~/models/AccountModel'
import HotlineModel from '~/models/HotlineModel'
import { RedisService } from './redis'

enum ClientStatus {
  IDLE = 'idle',
  BUSY = 'busy'
}

interface ClientInfo {
  socket: Socket
  status: ClientStatus
}

// const calculateRealDistance = (latFrom: number, lngFrom: number, latTo: number, lngTo: number): Promise<number> => {
//   return new Promise<number>((resolve, reject) => {
//     const request = new XMLHttpRequest()

//     request.open(
//       'GET',
//       `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.NOMINATIM_KEY}&start=${lngFrom},${latFrom}&end=${lngTo},${latTo}`
//     )

//     request.setRequestHeader(
//       'Accept',
//       'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
//     )

//     request.onreadystatechange = function () {
//       if (this.readyState === 4) {
//         if (this.status === 200) {
//           const responseObj = JSON.parse(this.responseText)
//           const distance = responseObj?.features[0]?.properties?.segments[0]?.distance
//           resolve(distance)
//         } else {
//           reject(new Error('Failed to fetch data'))
//         }
//       }
//     }

//     request.send()
//   })
// }

const calculateRealDistance = async (
  latFrom: number,
  lngFrom: number,
  latTo: number,
  lngTo: number
): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.NOMINATIM_KEY}&start=${lngFrom},${latFrom}&end=${lngTo},${latTo}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    const distance = data?.features[0]?.properties?.segments[0]?.distance

    if (typeof distance === 'number') {
      console.log(distance)
      return distance
    } else {
      throw new Error('Distance not found in response')
    }
  } catch (error) {
    throw error
  }
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

      socket.on('queryAddress', async (phone: any) => {
        const account = await AccountModel.findOne({ phone: phone })
        const user = await HotlineModel.findOne({ idAccount: account?._id })
          .populate('favoriteLocations')
          .populate({
            path: 'listOrder',
            populate: {
              path: 'from',
              model: 'Location'
            }
          })
          .populate({
            path: 'listOrder',
            populate: {
              path: 'to',
              model: 'Location'
            }
          })
        this.emitMessage(socket.id, 'getUser', user)
      })

      // Get vị trí hiện tại của tài xế trong order
      socket.on('getGeocodeDriver', async (idOrder: any) => {
        const redisService = RedisService.getInstance()
        try {
          const order = await redisService.get(idOrder)
          this.emitMessage(socket.id, 'getUser', order)
        } catch (error) {
          console.error('Error radis:', error)
        }
      })

      socket.on('customerBooking', async (message: any) => {
        console.log('Message from customerBooking:', message)
        // Check địa chỉ đã được định vị bằng Elastic-Search
        const elasticsearchService = ElasticsearchService.getInstance()
        const geocodeStart = await elasticsearchService.search(message.addressStart, '*')
        const geocodeEnd = await elasticsearchService.search(message.addressEnd, '*')
        console.log(geocodeStart)
        console.log(geocodeEnd)

        if (geocodeStart.length) {
          message.geocodeStart = geocodeStart[0]._source
        }
        if (geocodeEnd.length) {
          message.geocodeEnd = geocodeEnd[0]._source
        }

        try {
          const user = await AccountModel.findOne({ phone: message?.phone })
          if (user === null) {
            await UserFactory.createUser(
              'hotline',
              '',
              message?.phone,
              (Math.random() * 1000).toString(),
              message?.name || ''
            )
            const user = await AccountModel.findOne({ phone: message?.phone })
            message.user = user?._id
          } else {
            message.user = user._id
          }
        } catch (e) {
          console.log(e)
        }

        if (geocodeStart.length && geocodeEnd.length) {
          console.log('step3')
          // const distance = await calculateRealDistance(
          //   message?.geocodeStart?.lat,
          //   message?.geocodeStart?.lng,
          //   message?.geocodeEnd?.lat,
          //   message?.geocodeEnd?.lng
          // )
          const object = {
            ...message
          }
          publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: object })
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
