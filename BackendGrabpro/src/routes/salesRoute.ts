import express from 'express'
import saleController from '~/controllers/saleController'

const router = express.Router()

// Get all sales
router.route('/').get(saleController.getSales)

export default router
