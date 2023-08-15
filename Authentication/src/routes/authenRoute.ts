import express from 'express'
import authenController from '~/controllers/authenController'

const router = express.Router()

router.route('/login').post(authenController.login)
router.route('/register').post(authenController.register)

export default router
