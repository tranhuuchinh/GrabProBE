import MessageModel from '~/models/MessageModel'
import CustomerModel from '~/models/CustomerModel'
import express from 'express'
import { catchAsync } from '~/utils/catchAsync'

export default {
  getMessages: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id

    try {
      const messages = await MessageModel.find({ $or: [{ idReceiver: id }, { idSender: id }] })

      const customerQueries = messages.map(async (message) => {
        const senderPromise = CustomerModel.findOne({ idAccount: message.idSender }).exec()
        const receiverPromise = CustomerModel.findOne({ idAccount: message.idReceiver }).exec()
        const [sender, receiver] = await Promise.all([senderPromise, receiverPromise])
        return {
          _id: message._id,
          idSender: sender,
          idReceiver: receiver,
          content: message.content,
          createdAt: message.createdAt
        }
      })

      // Thực hiện tất cả các truy vấn đồng thời bằng Promise.all
      const messagesWithCustomerData = await Promise.all(customerQueries)
      console.log(messagesWithCustomerData)

      res.status(200).json({
        status: 'success',
        data: messagesWithCustomerData
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
