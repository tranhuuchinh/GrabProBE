import express from 'express'
import ordersController from '~/controllers/ordersController'

const router = express.Router()

// Get all orders
router.route('/').get(ordersController.getOrders)

// Update feedback
router.route('/:id').patch(ordersController.updateFeedBack)
router.route('/:id').patch(ordersController.updateStatus)

export default router
