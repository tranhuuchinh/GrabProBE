import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import BillModel from '~/models/BillModel'

export default {
  getBills: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.query.idOrder

    try {
      if (req.query.idOrder) {
        const bills = await BillModel.find({ idOrder: id }).populate('idOrder').sort({ createdAt: -1 }).exec()
        res.status(200).json({
          status: 'success',
          total: bills.length,
          data: bills
        })
      } else {
        const bills = await BillModel.find({}).populate('idOrder').sort({ createdAt: -1 }).exec()
        res.status(200).json({
          status: 'success',
          total: bills.length,
          data: bills
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
