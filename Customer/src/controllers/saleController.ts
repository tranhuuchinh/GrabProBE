import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import SaleModel from '~/models/SaleModel'
import AwardModel from '~/models/AwardModel'

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
  }),

  getAward: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const awards = await AwardModel.find({}).exec()
      res.status(200).json({
        status: 'success',
        total: awards.length,
        data: awards
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
