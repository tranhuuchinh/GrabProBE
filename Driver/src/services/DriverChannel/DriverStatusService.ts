import * as amqp from 'amqplib/callback_api'
import { socketManager } from '~/index'

class DriverStatusService {
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Driver Status Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'DRIVER_FIND_DRIVER') {
            console.log(message.data)
            // 1. Nhận thông tin khách hàng từ Coordinator gửi về tất cả tài xế
            socketManager.sendBroadcastWithType(message.data.type, 'driverClient', message.data)

            channel.ack(msg)
          } else if (message.type === 'DRIVER_EMIT_DRIVER') {
            console.log('Tài xế EMIT')
            console.log(message.data)

            // 2. Coordinator tính toán được tài xế có ngắn nhất để gửi về tài xế đó kèm với idOrder
            socketManager.emitMessage(message.data?.idDriver, 'requestOrder', message.data.idOrder)

            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

export default DriverStatusService
