import express from 'express'
import { BaseLogger } from '~/services/ErrorDecorator/BaseLogger'
import { Logger } from '~/services/ErrorDecorator/Logger'
import { ErrorLoggerDecorator } from '~/services/ErrorDecorator/LoggerDecorator'
import AccountModel from '~/models/AccountModel'
import LocationModel from '~/models/LocationModel'
import UserFactory from '~/services/UserService/UserFactory'
import { catchAsync } from '~/utils/catchAsync'

const baseLogger: Logger = new BaseLogger()
const errorLogger: Logger = new ErrorLoggerDecorator(baseLogger)

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
      errorLogger.log(error.message)
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
    const type = req.query.type

    try {
      const account = await AccountModel.findByIdAndDelete(id)
      // const account = {}

      if (!account) {
        return res.status(404).json({
          status: 'error',
          message: 'No account with id'
        })
      }

      if (type === 'Customer') {
        const customer = await UserFactory.deleteUser('customer', id)

        if (!customer) {
          return res.status(404).json({
            status: 'error',
            message: 'No customer with id'
          })
        } else {
          return res.status(200).json({
            status: 'success',
            data: [account, customer]
          })
        }
      } else if (type === 'Driver') {
        const driver = await UserFactory.deleteUser('driver', id)

        if (!driver) {
          return res.status(404).json({
            status: 'error',
            message: 'No driver with id'
          })
        } else {
          return res.status(200).json({
            status: 'success',
            data: [account, driver]
          })
        }
      } else if (type === 'Staff') {
        const hotline = await UserFactory.deleteUser('hotline', id)

        if (!hotline) {
          return res.status(404).json({
            status: 'error',
            message: 'No hotline with id'
          })
        } else {
          return res.status(200).json({
            status: 'success',
            data: [account, hotline]
          })
        }
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  getAccount: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await AccountModel.find({})

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

  getLocation: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await LocationModel.find({})

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
