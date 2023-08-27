import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import PaymentModel from '~/models/PaymentModel'
import { PaymentModelBuilder } from '~/services/PaymentService/PaymentBuilder'

export default {
  getPayments: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const payments = await PaymentModel.find({}).exec()
      res.status(200).json({
        status: 'success',
        total: payments.length,
        data: payments
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  createPayments: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const pmBuilder = new PaymentModelBuilder().withTitle(req.body.title).withImage(req.body.image)

      const pmMethod = pmBuilder.build()
      await pmMethod.save()
      res.status(200).json({
        status: 'success',
        data: pmMethod
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
