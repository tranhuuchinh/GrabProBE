import express from 'express'
import boxchatController from '~/controllers/boxchatController'

const router = express.Router()

// Get boxchats
router.route('/').get(boxchatController.getBoxChat)

export default router
