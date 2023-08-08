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
          console.log('geo', message)
          if (message.type === 'GEOLOCATION_RESOLVED') {
            // Gửi socket về cho bộ phận theo dõi đơn hàng

            publishToMediator({ type: 'COORDINATOR_RESOLVED', data: message.data })
          }
        }
      },
      { noAck: false }
    )
  }
}

export default CoordinatorService
