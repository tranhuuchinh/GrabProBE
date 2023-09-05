import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import PaymentModel from '~/models/PaymentModel'
import { PaymentModelBuilder } from '~/services/PaymentService/PaymentBuilder'
import { Twilio } from 'twilio'

export default {
  getPayments: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const accountSid = 'hehe'
      const authToken = '123'
      const client = new Twilio(accountSid, authToken)

      client.messages
        .create({
          from: '+12565884188',
          to: '+84377023495',
          body: 'Con Chó Chính  '
        })
        .then((message) => console.log(message.sid))
        .catch((error) => console.log(error))

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
