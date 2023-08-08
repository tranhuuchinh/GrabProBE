import express from 'express'
import paymentController from '~/controllers/paymentController'

const router = express.Router()

// Get all payments
router.route('/').get(paymentController.getPayments)

// Create new payments
router.route('/').post(paymentController.createPayments)

export default router
