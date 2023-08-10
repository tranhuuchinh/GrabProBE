import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'
import { socketManager } from '~/index'

class GeolocationService {
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Geolocation Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'CUSTOMER_REQUESTED') {
            console.log('geo', message)
            // Gửi socket về cho client S2 định vị location
            socketManager.sendBroadcastGeolocaion('Định vị đi')
            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

export default GeolocationService
