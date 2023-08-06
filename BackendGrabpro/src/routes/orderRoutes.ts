import express from 'express'
import ordersController from '~/controllers/ordersController'

const router = express.Router()

// Get all orders
router.route('/').get(ordersController.getOrders)

router.route('/:id').patch(ordersController.updateStatus)

export default router
