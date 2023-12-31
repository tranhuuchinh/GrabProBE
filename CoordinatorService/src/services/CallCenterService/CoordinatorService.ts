/* eslint-disable no-useless-catch */
import * as amqp from 'amqplib/callback_api'
import { publishToMediator } from './mediator'
import LocationModel from '~/models/LocationModel'
import HotlineModel from '~/models/HotlineModel'
import TypeTransportModel from '~/models/TypeTransportModel'
import OrderModel from '../../models/OrderModel'
import { RedisService } from '../redis'
import ConditionModel from '~/models/ConditionModel'

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

interface OrderDriverInfoStore {
  [idOrder: string]: Driver[]
}

const calculateRealDistance = async (
  latFrom: number,
  lngFrom: number,
  latTo: number,
  lngTo: number
): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.NOMINATIM_KEY}&start=${lngFrom},${latFrom}&end=${lngTo},${latTo}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    const distance = data?.features[0]?.properties?.segments[0]?.distance

    if (typeof distance === 'number') {
      console.log(distance)
      return distance / 1000
    } else {
      throw new Error('Distance not found in response')
    }
  } catch (error) {
    throw error
  }
}

async function getWeatherData(lat: number, lon: number) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_KEY}`

  try {
    const response = await fetch(apiUrl)

    if (response.status === 200) {
      // Parse dữ liệu JSON
      const weatherData = await response.json()
      return weatherData
    } else {
      throw new Error(`Không thể lấy dữ liệu. Mã trạng thái: ${response.status}`)
    }
  } catch (error: any) {
    throw new Error(`Lỗi khi lấy dữ liệu thời tiết: ${error.message}`)
  }
}

// const value = 'config.Time = BUOI_CHIEU & config.Time>=17 && config.Time <=19 && Location == Q3@@DieuPhoi.UuTien'
// const timeCondition = 'config.Time >= 0 && config.Time <= 19=>>0.2'
// const locationCondition =
//   'config.LocationFrom.indexOf("Quận 1") !== -1 || config.LocationTo.indexOf("Quận 1") !== -1=>>0.1'
// const weatherCondition =
//   'config.Weather[0]?.main === "Rain" || config.Weather[0]?.main === "Thunderstorm" || config.Weather[0]?.main === "Tornado" || config.Weather[0]?.main === "Drizzle"=>>0.2'

class CoordinatorService {
  static orderDriverInfoStore: OrderDriverInfoStore = {}
  constructor() {}
  public static startListening = async (channel: amqp.Channel, queueName: string) => {
    const redisService = RedisService.getInstance()
    CoordinatorService.orderDriverInfoStore = {}

    console.log('Coordinator Service is listening...')
    channel.consume(
      queueName,
      async (msg: any) => {
        if (msg && msg.content) {
          const message = JSON.parse(msg.content?.toString())

          if (message.type === 'GEOLOCATION_RESOLVED') {
            console.log(message.data)

            const weather = await getWeatherData(message?.data?.geocodeStart?.lat, message?.data?.geocodeStart?.lng)
            const currentDate = new Date()
            const hours = currentDate.getHours()

            const condition = await ConditionModel.find().lean()

            let percent = 0
            const config = {
              Time: hours,
              LocationFrom: message?.data?.addressStart,
              LocationTo: message?.data?.geocodeEnd,
              Weather: weather?.weather
            }

            for (let i = 0; i < condition.length; i++) {
              const items = condition[i].value?.split('=>>')
              if (eval(items[0])) {
                percent += parseFloat(items[1])
              }
            }
            console.log(percent)

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
            try {
              const typeTransport = await TypeTransportModel.findOne({ name: message?.data?.type })
              if (typeTransport) {
                const pricePerKm = typeTransport.priceperKm

                const distance = await calculateRealDistance(
                  message?.data?.geocodeStart?.lat,
                  message?.data?.geocodeStart?.lng,
                  message?.data?.geocodeEnd?.lat,
                  message?.data?.geocodeEnd?.lng
                )

                // Tính toán totalPrice dựa trên pricePerKm và distance
                const totalPrice = pricePerKm * distance * (1 + percent)

                const order = await (
                  await (
                    await OrderModel.create({
                      idCustomer: message?.data?.user,
                      from: locationStart?._id,
                      to: locationEnd?._id,
                      type: message?.data?.type,
                      totalPrice: totalPrice,
                      distance: distance.toString() + 'Km'
                    })
                  ).populate('from')
                ).populate('to')

                // Update Location và Order vào Hotline model
                const user = await HotlineModel.findOne({ idAccount: message?.data?.user }).populate('idAccount')
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

                const inforData = {
                  idCustomer: message?.data?.user,
                  lat: message?.data?.geocodeStart?.lat,
                  lon: message?.data?.geocodeStart?.lng,
                  idOrder: order?._id,
                  type: message?.data?.type
                }

                console.log('Gửi qua tìm Driver')
                console.log(inforData)

                publishToMediator({ type: 'DRIVER_FIND_DRIVER_1', data: inforData })

                const newOrder = { user, order }
                publishToMediator({ type: 'RIDE_STATUS_UPDATED', data: newOrder })
              }
            } catch (error) {
              console.error('Error creating order:', error)
            }

            // Tiến hành điều phối xe
            channel.ack(msg)
          } else if (message.type === 'COORDINATION_FIND_DRIVER') {
            console.log(message.data)

            // 1. Nhận thông tin khách hàng từ Customer Server và push qua Driver Server để tìm tài xế
            publishToMediator({ type: 'DRIVER_FIND_DRIVER', data: message?.data })
            channel.ack(msg)
          } else if (message.type === 'COORDINATION_BOOK_REQUEST') {
            console.log('BOOK' + message.data)
            const idOrder = message?.data?.idOrder
            const driversData = message?.data?.drivers

            if (idOrder && driversData) {
              if (!this.orderDriverInfoStore[idOrder]) {
                this.orderDriverInfoStore[idOrder] = []
              }

              // Lưu thông tin tài xế và đơn hàng vào store tạm thời
              this.orderDriverInfoStore[idOrder].push(...driversData)

              // Sắp xếp lại danh sách theo khoảng cách tăng dần
              const distances: number[] = []

              for (const driver of this.orderDriverInfoStore[idOrder]) {
                const distance = await calculateRealDistance(
                  driver.from.lat,
                  driver.from.lng,
                  driver.to.lat,
                  driver.to.lng
                )
                distances.push(distance)
              }

              this.orderDriverInfoStore[idOrder].sort((driverA: Driver, driverB: Driver) => {
                const indexA = this.orderDriverInfoStore[idOrder].indexOf(driverA)
                const indexB = this.orderDriverInfoStore[idOrder].indexOf(driverB)
                return distances[indexA] - distances[indexB]
              })

              // Lấy 3 phần tử đầu để gửi về cho khách hàng
              const closestDrivers = this.orderDriverInfoStore[idOrder].slice(0, 3)
              console.log('CUSTOMER_AROUND_DRIVER')
              console.log(closestDrivers)

              publishToMediator({ type: 'CUSTOMER_AROUND_DRIVER', data: closestDrivers })

              // Lấy phần tử đầu tiên (ngắn nhất) để gửi về cho tài xế
              if (this.orderDriverInfoStore[idOrder].length > 0) {
                const shortestDistanceDriver = this.orderDriverInfoStore[idOrder][0]
                const driverIdOrderInfo = {
                  idOrder: idOrder,
                  idDriver: shortestDistanceDriver.idDriver
                }
                console.log('DRIVER_EMIT_DRIVER')
                console.log(driverIdOrderInfo)

                publishToMediator({ type: 'DRIVER_EMIT_DRIVER', data: driverIdOrderInfo })
              }
            }

            channel.ack(msg)
          } else if (message.type === 'COORDINATION_ACCEPT_REQUEST') {
            // 4. Tài xế đã nhận lên đây xóa order đó trong store đồng thời xóa luôn tài xế đó
            // ra khỏi hàng chờ các đơn hàng khác
            // data là idOrder, idDriver, idCustomer
            for (const orderId in this.orderDriverInfoStore) {
              if (orderId !== message?.data?.idOrder) {
                this.orderDriverInfoStore[orderId] = this.orderDriverInfoStore[orderId].filter(
                  (driver: Driver) => driver?.idDriver !== message?.data?.idDriver
                )
              }
            }

            if (this.orderDriverInfoStore[message?.data?.idOrder]) {
              this.orderDriverInfoStore[message?.data?.idOrder].shift()
            }

            channel.ack(msg)
          } else if (message.type === 'COORDINATION_ORDER_TRACKING') {
            // Lưu vào radis để theo dõi lịch trình
            const driverLocation = message?.data.location
            const orderId = message?.data?.idOrder

            if (orderId) {
              try {
                const order = await OrderModel.findOne({ _id: orderId })
                if (order) {
                  const oldOrder = JSON.parse((await redisService.get(orderId)) || '{}')
                  const dataToStore = {
                    user: oldOrder?.user,
                    order,
                    driverLocation: driverLocation
                  }

                  await redisService.set(orderId, JSON.stringify(dataToStore))
                } else {
                  console.error(`Order with ID ${orderId} not found`)
                }
              } catch (error) {
                console.error('Error:', error)
              }
            }

            channel.ack(msg)
          } else if (message.type === 'COORDINATION_DENY_REQUEST') {
            // 5. Tài xế bỏ cuốc, kiếm thằng khác
            // data là idOrder, idDriver
            if (this.orderDriverInfoStore[message?.data?.idOrder]) {
              this.orderDriverInfoStore[message?.data?.idOrder] = this.orderDriverInfoStore[
                message?.data?.idOrder
              ].filter((driver: Driver) => driver?.idDriver !== message?.data?.idDriver)
            }

            // //Kiếm lại thằng tiếp theo trong danh sách
            if (this.orderDriverInfoStore[message?.data?.idOrder]?.length > 0) {
              const shortestDistanceDriver = this.orderDriverInfoStore[message?.data?.idOrder][0]
              const driverIdOrderInfo = {
                idOrder: message?.data?.idOrder,
                idDriver: shortestDistanceDriver?.idDriver
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
