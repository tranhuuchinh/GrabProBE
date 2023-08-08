import express from 'express'

export const catchAsync = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
