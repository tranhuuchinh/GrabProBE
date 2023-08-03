import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import InformModel from '~/models/InformModel'

export default {
  getInforms: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.query.idUser

    try {
      if (req.query.idUser) {
        InformModel.find({ idReceiver: id }).then((inform) => {
          res.status(200).json({
            status: 'success',
            total: inform.length,
            data: inform
          })
        })
      } else {
        InformModel.find({}).then((inform) => {
          res.status(200).json({
            status: 'success',
            total: inform.length,
            data: inform
          })
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
