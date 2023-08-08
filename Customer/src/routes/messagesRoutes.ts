import express from 'express'
import messagesController from '~/controllers/messagesController'

const router = express.Router()

// Get messgages
router.route('/:id').get(messagesController.getMessages)

// Create message
router.route('/:idBox').post(messagesController.createMessases)

export default router
