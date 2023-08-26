import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import PaymentModel from '~/models/PaymentModel'
import { PaymentModelBuilder } from '~/services/PaymentService/PaymentBuilder'
import { Auth } from '@vonage/auth'
import { Messages, SMS } from '@vonage/messages'
import { readFileSync } from 'fs'

const privateKeyPath = `${__dirname}/private.test.key`
const privateKeyString = readFileSync(privateKeyPath).toString()

console.log(privateKeyString)

const messagesClient = new Messages(
  new Auth({
    apiKey: '8e6aed8e',
    apiSecret: 'Z1FZxqeN98SQtMUj',
    applicationId: '1234',
    privateKey: privateKeyString
  })
)

messagesClient
  .send(new SMS('Nội dung tin nhắn', '84898919260', 'Vonage APIs', 'clientRef'))
  .then((resp) => console.log(resp))
  .catch((err) => console.error(err))

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
