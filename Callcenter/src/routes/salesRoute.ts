import express from 'express'
import saleController from '~/controllers/saleController'

const router = express.Router()

// Get all sales
router.route('/').get(saleController.getSales)

// Get all awards
router.route('/awards').get(saleController.getAward)

export default router
