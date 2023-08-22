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
          if (message.type === 'CUSTOMER_AROUND_DRIVER') {
            console.log(message)
            // 1. 4 vị trí tài xế gần nhất để hiển thị bên bản đồ từ Coordinate trả về
            // Data trả về là idCustomer và mảng tọa độ các driver
            socketManager.emitMessage(message.data.idCustomer, 'findDriver', message.data.drivers)
            channel.ack(msg)
          } else if (message.type === 'CUSTOMER_ACCEPT_REQUEST') {
            console.log(message)
            // 2. Tài xế cuối cùng xác nhận => Hoàn thiện order
            // Data trả về là idOrder, idDriver, idCustomer
            // Emit về data là idDriver
            socketManager.emitMessage(message.data.idCustomer, 'acceptedDriver', message.data.idDriver)

            channel.ack(msg)
          } else if (message.type === 'CUSTOMER_FOLLOW_DRIVER') {
            console.log(message)
            // Data trả về là idCustomer và {lat, lng} của Driver
            // Từ idOrder tra ra idCustomer emit về data là idDriver
            socketManager.emitMessage(message.data.idCustomer, 'followDriver', message.data.location)

            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

export default CustomerStatusService
