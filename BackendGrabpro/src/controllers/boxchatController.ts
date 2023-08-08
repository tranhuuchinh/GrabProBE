import BoxChatModel from '~/models/BoxChatModel'
import express from 'express'
import { catchAsync } from '~/utils/catchAsync'

export default {
  getBoxChat: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.query.idUser

    try {
      const boxchats = await BoxChatModel.find({ $or: [{ idCustomer: id }, { idDriver: id }] })
        .populate('idOrder', 'to status')
        .populate('listMessages')
        .exec()

      res.status(200).json({
        status: 'success',
        data: boxchats
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
