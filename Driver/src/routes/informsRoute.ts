import express from 'express'
import informController from '~/controllers/informController'

const router = express.Router()

// Get all informs
router.route('/').get(informController.getInforms)

export default router
