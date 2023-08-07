import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import DriverModel from '~/models/DriverModel'

export default {
  getDriver: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id

    try {
      const driver = await DriverModel.findOne({ idAccount: id }).populate('location').exec()

      if (!driver) {
        return res.status(404).json({
          status: 'error',
          message: 'No driver found'
        })
      }

      res.status(200).json({
        status: 'success',
        data: driver
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
