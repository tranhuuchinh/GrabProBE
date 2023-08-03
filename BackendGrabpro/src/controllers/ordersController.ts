import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import OrderModel from '~/models/OrderModel'

export default {
  getOrders: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.query.idUser

    try {
      if (req.query.idUser) {
        const orders = await OrderModel.find({ $or: [{ idCustomer: id }, { idDriver: id }] })
          .populate('from')
          .populate('to')
          .exec()

        res.status(200).json({
          status: 'success',
          total: orders.length,
          data: orders
        })
      } else {
        const orders = await OrderModel.find({}).populate('from').populate('to').exec()

        res.status(200).json({
          status: 'success',
          total: orders.length,
          data: orders
        })
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
