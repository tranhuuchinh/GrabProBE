import express from 'express'
import UserFactory from '~/services/UserService/UserFactory'
import { catchAsync } from '~/utils/catchAsync'

export default {
  createCustomer: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, phone, fullname, password } = req.body

    try {
      const user = await UserFactory.createUser('customer', email, phone, password, fullname)

      res.status(200).json({
        status: 'success',
        data: user
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  createDriver: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, phone, fullname, password } = req.body

    try {
      const user = await UserFactory.createUser('driver', email, phone, password, fullname)

      res.status(200).json({
        status: 'success',
        data: user
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  createHotline: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { phone, fullname } = req.body

    try {
      const user = await UserFactory.createUser('hotline', '', phone, (Math.random() * 1000).toString(), fullname || '')

      res.status(200).json({
        status: 'success',
        data: user
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  createAdmin: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, phone, fullname, password } = req.body

    try {
      const user = await UserFactory.createUser('admin', email, phone, password, fullname || '')

      res.status(200).json({
        status: 'success',
        data: user
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
