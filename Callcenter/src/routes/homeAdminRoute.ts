import express from 'express'
import homeAdminController from '~/controllers/homeAdminController'

const router = express.Router()

// Get profile customer
router.route('/').get(homeAdminController.getRevenueForDay)

// Update profile customer
// router.route('/profile/:id').patch(customerController.updateCustomer)

// Update bonus points
// router.route('/bonus/:id').patch(customerController.updateBonus)

export default router
