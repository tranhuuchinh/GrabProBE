import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'
import LocationModel from '~/models/LocationModel'
import HotlineModel from '~/models/HotlineModel'
import OrderModel from '../../models/OrderModel'

class CoordinatorService {
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Coordinator Service is listening...')
    channel.consume(
      queueName,
      async (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'GEOLOCATION_RESOLVED') {
            // Tạo Location model
            let locationStart = await LocationModel.findOne({ address: message?.data?.addressStart })
            if (locationStart === null) {
              locationStart = await LocationModel.create({
                address: message?.data?.addressStart,
                latitude: message?.data?.geocodeStart?.lat,
                altitude: message?.data?.geocodeStart?.lng
              })
            }
            let locationEnd = await LocationModel.findOne({ address: message?.data?.addressEnd })
            if (locationEnd === null) {
              locationEnd = await LocationModel.create({
                address: message?.data?.addressEnd,
                latitude: message?.data?.geocodeEnd?.lat,
                altitude: message?.data?.geocodeEnd?.lng
              })
            }
            // Tạo Order
            const order = await OrderModel.create({
              idCustomer: message?.data?.user,
              from: locationStart?._id,
              to: locationEnd?._id,
              type: message?.data?.type
            })
            // Update Location và Order vào Hotline model
            const user = await HotlineModel.findOne({ idAccount: message?.data?.user })
            const locations = user?.favoriteLocations || []
            locations.push(locationStart?._id)
            locations.push(locationEnd?._id)
            const orders = user?.listOrder || []
            orders.push(order?._id)
            await HotlineModel.findOneAndUpdate(
              { idAccount: message?.data?.user },
              {
                favoriteLocations: locations,
                listOrder: orders
              }
            )
            console.log('coor', order)

            // Tiến hành điều phối xe
            // const order = await Order({
            //   idCustomer:
            // })

            // publishToMediator({ type: 'COORDINATOR_RESOLVED', data: message.data })
            publishToMediator({ type: 'RIDE_STATUS_UPDATED', data: message?.data })

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
