import MessageModel from '~/models/MessageModel'
import express from 'express'
import { catchAsync } from '~/utils/catchAsync'

export default {
  getMessages: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id

    try {
      const messages = await MessageModel.find({ $or: [{ idReceiver: id }, { idSender: id }] })

      res.status(200).json({
        status: 'success',
        data: messages
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
