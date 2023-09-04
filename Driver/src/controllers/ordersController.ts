import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import OrderModel from '~/models/OrderModel'

interface Order {
  _id: string
  code: string
  idCustomer: string
  idDriver: string
  from: {
    _id: string
    address: string
    description: string
    latitude: number
    altitude: number
    __v: number
  }
  to: {
    _id: string
    address: string
    description: string
    latitude: number
    altitude: number
    __v: number
  }
  distance: string
  status: number
  method: number
  feedback: number
  tax: number
  baseTax: number
  sale: number
  totalPrice: number
  createdAt: string
  updatedAt: string
  __v: number
  type: string
}

export default {
  getOrders: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.query.idUser
    const type = req.query.type

    try {
      if (req.query.idUser) {
        const orders = await OrderModel.find({ $or: [{ idCustomer: id }, { idDriver: id }] })
          .populate('from')
          .populate('to')
          .exec()

        if (type) {
          let filteredOrders = []
          if (type === 'GrabCar') {
            filteredOrders = orders.filter((item) => {
              const orderType = (item as unknown as Order).type
              return orderType === '4seats' || orderType === '7seats'
            })
          } else {
            filteredOrders = orders.filter((item) => (item as unknown as Order).type === 'motobike')
          }
          res.status(200).json({
            status: 'success',
            total: filteredOrders.length,
            data: filteredOrders
          })
        } else {
          res.status(200).json({
            status: 'success',
            total: orders.length,
            data: orders
          })
        }
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
  }),

  updateFeedBack: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const star = req.body.star

    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(id, { feedback: star }, { new: true }).exec()

      if (!updatedOrder) {
        return res.status(404).json({
          status: 'error',
          message: 'Order not found'
        })
      }

      res.status(200).json({
        status: 'success',
        data: updatedOrder
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  updateStatus: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id

    try {
      const order = await OrderModel.findOneAndUpdate({ _id: id }, { status: 0 }, { new: true }).exec()

      if (!order) {
        return res.status(404).json({
          status: 'error',
          message: 'No order with id'
        })
      }

      res.status(200).json({
        status: 'success',
        data: order
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
