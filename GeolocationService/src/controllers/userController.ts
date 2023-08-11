import express from 'express'
import AccountModel from '~/models/AccountModel'
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
  }),

  deleteAccount: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id

    try {
      const user = await AccountModel.findByIdAndDelete(id)

      console.log(id)

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'No user with id'
        })
      }

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

  getAllCustomer: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await UserFactory.getAllUser('customer')

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

  getAllDriver: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await UserFactory.getAllUser('driver')

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

  getAllHotline: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await UserFactory.getAllUser('hotline')

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
