import express from 'express'
import { catchAsync } from '~/utils/catchAsync'
import BillModel from '~/models/BillModel'
import mongoose from 'mongoose'

interface Bill {
  _id: string
  idOrder: {
    _id: string
    code: string
    idCustomer: mongoose.Types.ObjectId
    idDriver: mongoose.Types.ObjectId
    from: string
    to: string
    distance: string
    status: number
    method: number
    feedback: number
    tax: number
    baseTax: number
    sale: number
    totalPrice: number
    createdAt: string
    updatedAt: string
    __v: number
    type: string
  }
  payfor: string
  createdAt: string
  updatedAt: string
  __v: number
}

export default {
  getBills: catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const idOrder = req.query.idOrder
    const type = req.query.type
    const idUser = req.query.idUser

    try {
      if (req.query.idOrder) {
        const bills = await BillModel.find({ idOrder: idOrder }).populate('idOrder').sort({ createdAt: -1 }).exec()
        res.status(200).json({
          status: 'success',
          total: bills.length,
          data: bills
        })
      } else if (req.query.type) {
        const bills = await BillModel.find({}).populate('idOrder').sort({ createdAt: -1 }).exec()
        const filteredBills = bills.filter((item) => {
          const bill = item as unknown as Bill
          const idOrder = bill.idOrder

          if (typeof idUser === 'string' && idUser) {
            const userId = new mongoose.Types.ObjectId(idUser)
            return idOrder.type === type && (idOrder.idCustomer.equals(userId) || idOrder.idDriver.equals(userId))
          } else {
            return idOrder.type === type
          }
        })

        res.status(200).json({
          status: 'success',
          total: filteredBills.length,
          data: filteredBills
        })
      } else if (!type && idUser) {
        const bills = await BillModel.find({}).populate('idOrder').sort({ createdAt: -1 }).exec()
        const filteredBills = bills.filter((item) => {
          const bill = item as unknown as Bill
          const idOrder = bill.idOrder

          if (typeof idUser === 'string') {
            const userId = new mongoose.Types.ObjectId(idUser)
            return idOrder.idCustomer.equals(userId) || idOrder.idDriver.equals(userId)
          }
        })

        res.status(200).json({
          status: 'success',
          total: filteredBills.length,
          data: filteredBills
        })
      } else {
        const bills = await BillModel.find({}).populate('idOrder').sort({ createdAt: -1 }).exec()
        res.status(200).json({
          status: 'success',
          total: bills.length,
          data: bills
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
