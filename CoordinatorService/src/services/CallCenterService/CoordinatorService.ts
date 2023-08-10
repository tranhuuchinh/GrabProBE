import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'

class CoordinatorService {
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Coordinator Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'GEOLOCATION_RESOLVED') {
            console.log('coor', message)
            // Tiến hành điều phối xe

            // publishToMediator({ type: 'COORDINATOR_RESOLVED', data: message.data })
            publishToMediator({ type: 'RIDE_STATUS_UPDATED', data: 'COORDINATOR_RESOLVED' })
            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

export default CoordinatorService
