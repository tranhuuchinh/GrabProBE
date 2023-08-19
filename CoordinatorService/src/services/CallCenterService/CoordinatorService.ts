import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'

interface LocationDriver {
  from: { lat: number; lng: number }
  to: { lat: number; lng: number }
}

interface Driver {
  idDriver: string
  from: {
    lat: number
    lng: number
  }
  to: {
    lat: number
    lng: number
  }
}

// Wait for Chinh
const calculateRealDistance = (latFrom: number, lngFrom: number, latTo: number, lngTo: number) => {
  return 20
}

class CoordinatorService {
  orderDriverInfoStore: object
  static orderDriverInfoStore: any
  constructor() {
    this.orderDriverInfoStore = {}
  }
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    console.log('Coordinator Service is listening...')
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content.toString())
          if (message.type === 'GEOLOCATION_RESOLVED') {
            // Tiến hành điều phối xe
            channel.ack(msg)
          } else if (message.type === 'COORDINATION_FIND_DRIVER') {
            // 1. Nhận thông tin khách hàng từ Customer Server và push qua Driver Server để tìm tài xế
            publishToMediator({ type: 'DRIVER_FIND_DRIVER', data: message.data })
            channel.ack(msg)
          } else if (message.type === 'COORDINATION_BOOK_REQUEST') {
            const idOrder = message.data.idOrder
            const driversData = message.data.drivers

            if (!this.orderDriverInfoStore[idOrder]) {
              this.orderDriverInfoStore[idOrder] = []
            }

            // Lưu thông tin tài xế và đơn hàng vào store tạm thời
            this.orderDriverInfoStore[idOrder].push(...driversData)

            // Sắp xếp lại danh sách theo khoảng cách tăng dần
            this.orderDriverInfoStore[idOrder].sort((driverA: LocationDriver, driverB: LocationDriver) => {
              const distanceA = calculateRealDistance(
                driverA.from.lat,
                driverA.from.lng,
                driverA.to.lat,
                driverA.to.lng
              )
              const distanceB = calculateRealDistance(
                driverB.from.lat,
                driverB.from.lng,
                driverB.to.lat,
                driverB.to.lng
              )
              return distanceA - distanceB
            })

            // Lấy 3 phần tử đầu để gửi về cho khách hàng
            const closestDrivers = this.orderDriverInfoStore[idOrder].slice(0, 3)
            publishToMediator({ type: 'CUSTOMER_AROUND_DRIVER', data: closestDrivers })

            // Lấy phần tử đầu tiên (ngắn nhất) để gửi về cho tài xế
            if (this.orderDriverInfoStore[idOrder].length > 0) {
              const shortestDistanceDriver = this.orderDriverInfoStore[idOrder][0]
              const driverIdOrderInfo = {
                idOrder: idOrder,
                idDriver: shortestDistanceDriver.idDriver
              }
              publishToMediator({ type: 'DRIVER_EMIT_DRIVER', data: driverIdOrderInfo })
            }
            channel.ack(msg)
          } else if (message.type === 'COORDINATION_ACCEPT_REQUEST') {
            // 4. Tài xế đã nhận lên đây xóa order đó trong store đồng thời xóa luôn tài xế đó
            // ra khỏi hàng chờ các đơn hàng khác
            // data là idOrder, idDriver, idCustomer
            for (const orderId in this.orderDriverInfoStore) {
              if (orderId !== message.data.idOrder) {
                this.orderDriverInfoStore[orderId] = this.orderDriverInfoStore[orderId].filter(
                  (driver: Driver) => driver.idDriver !== message.data.idDriver
                )
              }
            }

            this.orderDriverInfoStore[message.data.idOrder].shift()
            channel.ack(msg)
          } else if (message.type === 'COORDINATION_DENY_REQUEST') {
            // 5. Tài xế bỏ cuốc, kiếm thằng khác
            // data là idOrder, idDriver
            if (this.orderDriverInfoStore[message.data.idOrder]) {
              this.orderDriverInfoStore[message.data.idOrder] = this.orderDriverInfoStore[message.data.idOrder].filter(
                (driver: Driver) => driver.idDriver !== message.data.idDriver
              )
            }

            //Kiếm lại thằng tiếp theo trong danh sách
            if (this.orderDriverInfoStore[message.data.idOrder].length > 0) {
              const shortestDistanceDriver = this.orderDriverInfoStore[message.data.idOrder][0]
              const driverIdOrderInfo = {
                idOrder: message.data.idOrder,
                idDriver: shortestDistanceDriver.idDriver
              }
              publishToMediator({ type: 'DRIVER_EMIT_DRIVER', data: driverIdOrderInfo })
            }
            channel.ack(msg)
          }
        }
      },
      { noAck: false }
    )
  }
}

export default CoordinatorService
