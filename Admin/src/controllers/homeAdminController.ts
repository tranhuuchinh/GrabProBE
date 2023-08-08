import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import OrderModel from '~/models/OrderModel'
import CustomerModel from '~/models/CustomerModel'
import DriverModel from '~/models/DriverModel'

export default {
  getRevenueForDay: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const currentDate = new Date() // get realtime
      // currentDate.setHours(0, 0, 0, 0)
      const yesterday = new Date(currentDate)
      yesterday.setDate(currentDate.getDate() - 1)
      yesterday.setHours(23, 59, 59, 999) // Đặt giờ, phút, giây và milisecond thành cuối ngày hôm qua
      let totalSale = 0 // Tổng doanh thu trong ngày
      let totalOrder = 0 // Tổng số đơn hàng trong ngày

      // Lấy doanh thu trong ngày
      const listOrders = await OrderModel.find({
        create_at: {
          // $gte: currentDate,
          // $lt: new Date()
          $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }
      }).exec()

      listOrders.forEach((order) => {
        totalSale += order.totalPrice
      })

      // Lấy tổng đơn hàng trong ngày
      totalOrder = listOrders.length

      // Lấy khách hàng mới trong ngày
      const totalCustomer = await CustomerModel.find({
        create_at: {
          // $gte: currentDate,
          // $lt: new Date()
          $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }
      })
        .count()
        .exec()

      // Lấy tài xế mới trong ngày
      const totalDriver = await DriverModel.find({
        create_at: {
          // $gte: currentDate,
          // $lt: new Date()
          $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }
      })
        .count()
        .exec()

      // Lấy khách hàng đặt qua ứng dụng trong ngày
      const totalOrderApp = await OrderModel.find({
        create_at: {
          // $gte: currentDate,
          // $lt: new Date()
          method: 0,
          $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }
      })
        .count()
        .exec()

      // Lấy khách hàng đặt qua call center trong ngày
      const totalOrderCall = await OrderModel.find({
        create_at: {
          // $gte: currentDate,
          // $lt: new Date()
          method: 0,
          $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }
      })
        .count()
        .exec()

      const ress = {
        totalSale: totalSale,
        totalOrder: totalOrder,
        totalCustomer: totalCustomer,
        totalDriver: totalDriver,
        timeUpdate: currentDate,
        totalOrderApp: totalOrderApp,
        totalOrderCall: totalOrderCall,
        yesterday: yesterday
      }

      res.status(200).json({
        status: 'success',
        // total: ress.length,
        data: ress
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
