import express from 'express'
import customerController from '~/controllers/customerController'

const router = express.Router()

// Get profile customer
router.route('/profile/:id').get(customerController.getCustomer)

// Update profile customer
router.route('/profile/:id').patch(customerController.updateCustomer)

// Update bonus points
router.route('/bonus/:id').patch(customerController.updateBonus)

export default router
