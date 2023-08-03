import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import SaleModel from '~/models/SaleModel'

export default {
  getSales: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const sales = await SaleModel.find({}).exec()
      res.status(200).json({
        status: 'success',
        total: sales.length,
        data: sales
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
