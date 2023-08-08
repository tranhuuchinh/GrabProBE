import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'

class GeolocationService {
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Geolocation Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          console.log('geo', message)
          if (message.type === 'CUSTOMER_REQUESTED') {
            // Gửi socket về cho client định vị location
            // const geolocation = GeolocationService.resolveGeolocation(message.data)
            // publishToMediator({ type: 'GEOLOCATION_RESOLVED', data: message.data, geolocation })
          }
        }
      },
      { noAck: false }
    )
  }

  private static resolveGeolocation(address: string) {
    console.log(address)
    return { latitude: 123, longitude: 456 }
  }
}

export default GeolocationService
