import express from 'express'
import driverController from '~/controllers/driverController'

const router = express.Router()

// Get profile customer
router.route('/:id').get(driverController.getDriver)

export default router
