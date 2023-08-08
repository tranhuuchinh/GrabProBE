import express from 'express'
import callcenterController from '~/controllers/callcenterController'

const router = express.Router()

router.route('/').post(callcenterController.requestBook)

export default router
