import express from 'express'
import userController from '~/controllers/userController'

const router = express.Router()

// Create customer
router.route('/customer').post(userController.createCustomer)

router.route('/driver').post(userController.createDriver)

router.route('/hotline').post(userController.createHotline)

router.route('/admin').post(userController.createAdmin)

router.route('/:id').delete(userController.deleteAccount)

router.route('/customer').get(userController.getAllCustomer)

router.route('/driver').get(userController.getAllDriver)

router.route('/hotline').get(userController.getAllHotline)

export default router
