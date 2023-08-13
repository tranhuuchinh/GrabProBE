import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'
import { socketManager } from '~/index'

class DriverStatusService {
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Customer Status Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'DRIVER_RECEIVED') {
            console.log(message)
            // 1. Nhận thông tin khách hàng từ Coordinator gửi về tất cả tài xế
            // socketManager.sendBroadcastToClient()
            // 2. Coordinator tính toán được tài xế có ngắn nhất để gửi về tài xế đó kèm với idsocket
            // socketManager.emitMessage()

            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

export default DriverStatusService
