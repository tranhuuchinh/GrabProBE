import express from 'express'
import { catchAsync } from '~/utils/catchAsync'

export default {
  getAllAddress: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('cc')

    res.status(200).json({
      status: 'success',
      results: 0,
      data: 'cc1'
    })
  })
}
