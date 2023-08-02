import express from 'express'
import userController from '~/controllers/userController'

const router = express.Router()

// Create customer
router.route('/customer').post(userController.createCustomer)

router.route('/driver').post(userController.createDriver)

router.route('/hotline').post(userController.createHotline)

router.route('/admin').post(userController.createAdmin)

export default router
