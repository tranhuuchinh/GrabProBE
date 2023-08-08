import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'
import { consumeFromMediator } from './mediator'

export const rideStatusService = {
  startListening: async (channel: amqp.Channel, queueName: string) => {
    console.log('Ride Status Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'GEOLOCATION_RESOLVED') {
            // Xử lý cập nhật trạng thái cuốc xe và gửi thông điệp sự kiện RIDE_STATUS_UPDATED
            updateRideStatus(message.data.requestId, message.data.geolocation)
            publishToMediator({
              type: 'RIDE_STATUS_UPDATED',
              data: { requestId: message.data.requestId, status: 'updated' }
            })
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
