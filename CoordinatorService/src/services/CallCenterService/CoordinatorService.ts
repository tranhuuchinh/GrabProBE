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
            publishToMediator({ type: 'RIDE_STATUS_UPDATED', data: message })

            // 1. Nhận thông tin khách hàng từ Customer Server và push qua Driver Server để tìm tài xế
            publishToMediator({ type: 'DRIVER_RECEIVED_CUSTOMER', data: '' })

            // 2. Nhận được list Drivers tính toán những gần nhất gửi về cho Customer Server
            publishToMediator({ type: 'CUSTOMER_RECEIVED', data: '' })

            // 3. Tìm thằng Driver để xác nhận:
            publishToMediator({ type: 'DRIVER_RECEIVED_FIND', data: '' })

            // 4. Xác nhận thằng gần nhất để gửi về Customer Server
            publishToMediator({ type: 'CUSTOMER_RECEIVED', data: '' })

            // 5. Nhận được hủy đơn từ thằng gần nhất gửi tìm lại
            publishToMediator({ type: 'DRIVER_RECEIVED', data: '' })
            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

export default CoordinatorService
