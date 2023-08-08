import express from 'express'
import messagesController from '~/controllers/messagesController'

const router = express.Router()

// Get messgages
router.route('/:id').get(messagesController.getMessages)

export default router
