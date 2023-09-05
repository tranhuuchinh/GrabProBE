import express from 'express'
import driverController from '~/controllers/driverController'

const router = express.Router()

// Get profile driver
router.route('/:id').get(driverController.getDriver)
router.route('/:id').patch(driverController.updateDriver)

export default router
