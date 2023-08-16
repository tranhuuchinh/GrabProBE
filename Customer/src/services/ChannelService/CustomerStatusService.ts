import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'
import { socketManager } from '~/index'

class CustomerStatusService {
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Customer Status Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'CUSTOMER_RECEIVED') {
            console.log(message)
            // 1. 4 vị trí tài xế gần nhất để hiển thị bên bản đồ từ Coordinate trả về
            // 2. Tài xế cuối cùng xác nhận => Hoàn thiện order
            // 3. Tài xế hủy đơn hàng

            // Gửi về client đó
            // socketManager.emitMessage()

            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

export default CustomerStatusService
