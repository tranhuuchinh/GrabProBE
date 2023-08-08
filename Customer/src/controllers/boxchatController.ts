import BoxChatModel from '~/models/BoxChatModel'
import express from 'express'
import { catchAsync } from '~/utils/catchAsync'

export default {
  getBoxChat: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.query.idUser
    const idOrder = req.query.idOrder

    let query = {}

    if (idOrder) {
      query = { idOrder: idOrder }
    } else {
      query = { $or: [{ idCustomer: id }, { idDriver: id }] }
    }

    try {
      const boxchats = await BoxChatModel.find(query).populate('idOrder', 'to status').populate('listMessages').exec()

      res.status(200).json({
        status: 'success',
        length: boxchats.length,
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
