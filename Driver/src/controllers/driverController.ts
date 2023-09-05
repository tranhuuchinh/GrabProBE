import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import DriverModel from '~/models/DriverModel'
import OrderModel from '~/models/OrderModel'
import AccountModel from '~/models/AccountModel'

export default {
  getDriver: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id

    try {
      const driver = await DriverModel.findOne({ idAccount: id }).populate('location').exec()

      if (!driver) {
        return res.status(404).json({
          status: 'error',
          message: 'No driver found'
        })
      }

      const orders = await OrderModel.find({ idDriver: id }).exec()

      let rating = 0
      const length = orders.length

      //Rating depend on his feedback in orders
      orders.forEach((order) => {
        rating = rating + order.feedback
      })

      driver.rating = length > 0 ? rating / length : 0

      //Update for driver
      await driver.save()

      res.status(200).json({
        status: 'success',
        data: driver
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  updateDriver: catchAsync(async (req, res) => {
    const id = req.params.id // Lấy ID của tài xế từ tham số URL
    const { name, email, code, nameCar, color, type } = req.body

    try {
      // Tìm tài xế theo ID và cập nhật thông tin
      const driver = await DriverModel.findOneAndUpdate(
        { idAccount: id },
        {
          fullname: name,
          'transport.color': color,
          'transport.code': code,
          'transport.name': nameCar,
          'transport.type': type
        },
        { new: true } // Trả về tài xế đã cập nhật
      ).exec()

      if (!driver) {
        const error: Error = new Error('Không tìm thấy tài xế')
        return res.status(404).json({ status: 'error', message: error.message })
      }

      // Tìm tài khoản liên quan và cập nhật email
      const account = await AccountModel.findOneAndUpdate(
        { _id: driver.idAccount },
        { email: email },
        { new: true } // Trả về tài khoản đã cập nhật
      ).exec()

      res.status(200).json({
        status: 'success',
        message: 'Cập nhật thông tin tài xế thành công!',
        data: { driver, account }
      })
    } catch (error) {
      // Handle other errors if needed
      res.status(500).json({
        status: 'error'
        // message: error.message
      })
    }
  })
}
