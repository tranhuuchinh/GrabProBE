import express from 'express'
import billController from '~/controllers/billController'

const router = express.Router()

// Get all bills
router.route('/').get(billController.getBills)

export default router
