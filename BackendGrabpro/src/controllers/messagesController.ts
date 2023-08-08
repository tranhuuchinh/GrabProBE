import MessageModel from '~/models/MessageModel'
import BoxChatModel from '~/models/BoxChatModel'
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
  }),

  createMessases: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const idBox = req.params.idBox

    try {
      const messages = new MessageModel({
        idSender: req.body.idSender,
        idReceiver: req.body.idReceiver,
        content: req.body.content
      })

      const savedMessage = await messages.save()

      // Update listMessages in BoxChat
      BoxChatModel.findByIdAndUpdate(idBox, { $push: { listMessages: savedMessage._id } }, { new: true })
        .then(() => {
          res.status(200).json({
            status: 'success',
            data: savedMessage
          })
        })
        .catch((error) => {
          console.error('Error updating BoxChat:', error)
        })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
