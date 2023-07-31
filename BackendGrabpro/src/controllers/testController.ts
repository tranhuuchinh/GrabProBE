import express from 'express'

const catchAsync = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

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
