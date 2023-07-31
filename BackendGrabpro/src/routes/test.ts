// import addressController from '../controllers/testController'

import { Router } from 'express'
import express from 'express'
import testController from '../controllers/testController'

const router = express.Router()

// List all
router.route('/').get(testController.getAllAddress)

export default router
