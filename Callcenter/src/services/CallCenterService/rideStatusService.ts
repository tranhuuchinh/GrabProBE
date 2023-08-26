import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'
import { socketManager } from '~/index'

class RideStatusService {
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Ride Status Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'RIDE_STATUS_UPDATED') {
            console.log('ride', message)
            // Gửi socket về cho bộ phận S3 theo dõi đơn hàng
            socketManager.sendBroadcastToClient('FOLLOW_ORDER_CLIENT', message.data)
            publishToMediator({ type: 'SEND_SMS', data: message.data })

            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

const updateRideStatus = (requestId: string, geolocation: any) => {
  // Simulate updating ride status
  console.log(`Updating ride status for request ${requestId} with geolocation:`, geolocation)
}
export default RideStatusService
