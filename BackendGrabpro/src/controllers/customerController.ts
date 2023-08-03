import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import CustomerModel from '~/models/CustomerModel'
import AccountModel from '~/models/AccountModel'
import AwardModel from '~/models/AwardModel'
import { CustomerRepository } from '~/services/CustomerService/CustomerRepository'
import { BonusRepository } from '~/services/CustomerService/BonusRepository'

export default {
  getCustomer: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    let phone = ''
    let email = ''
    let mainAward = ''

    try {
      const customer = await CustomerModel.findOne({ idAccount: id })
        .populate('location')
        .populate('favoriteLocations')
        .populate('savedLocations')
        .exec()

      if (!customer) {
        return res.status(404).json({
          status: 'error',
          message: 'No customer found'
        })
      }

      //Get award
      AwardModel.find({}).then((awards) => {
        awards.forEach((award) => {
          if (award.minpoint !== undefined && award.maxpoint !== undefined) {
            if (customer.bonusPoint >= award.minpoint && customer.bonusPoint <= award.maxpoint) {
              mainAward = award.title
            } else {
              mainAward = ''
            }
          }
        })
      })

      //Get Phone and Email
      AccountModel.findOne({ _id: id })
        .then(async (account) => {
          phone = account?.phone || ''
          email = account?.email || ''

          const customerWithPhoneAndEmail = {
            ...customer.toObject(),
            phone,
            email,
            mainAward
          }

          res.status(200).json({
            status: 'success',
            data: customerWithPhoneAndEmail
          })
        })
        .catch(next)
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  updateCustomer: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const customerRepository = new CustomerRepository(CustomerModel, AccountModel)

    try {
      const [customer, account] = await customerRepository.updateCustomerAndAccount(
        id,
        req.body.fullname,
        req.body.email,
        req.body.phone
      )
      if (!customer) {
        return res.status(404).json({
          status: 'error',
          message: 'No customer with id'
        })
      }
      res.status(200).json({
        status: 'success',
        data: { customer, account }
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }),

  updateBonus: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const bonusPoint = req.body.bonusPoint
    const bonusRepository = new BonusRepository(CustomerModel)

    try {
      const customer = await bonusRepository.updateBonusPoint(id, bonusPoint)
      if (!customer) {
        return res.status(404).json({
          status: 'error',
          message: 'No customer with id'
        })
      }
      res.status(200).json({
        status: 'success',
        data: customer
      })
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  })
}
