/**
 * Required External Modules
 */
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoutes from '~/routes/userRoutes'
import customerRoutes from '~/routes/customerRoutes'
import orderRoutes from '~/routes/orderRoutes'
import driverRoute from '~/routes/driverRoute'
import { setupMediator } from './services/CallCenterService/mediator'
import CoordinatorService from './services/CallCenterService/CoordinatorService'
import SocketManager from './services/socket'

dotenv.config()

/**
 * App Variables
 */
const PORT: number = 3006

const app = express()
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  })
)

/**
 *  App Configuration
 */
app.use(express.json({ limit: '10mb' }))

/**
 * ROUTES
 */
app.use('/user', userRoutes)
app.use('/customer', customerRoutes)
app.use('/driver', driverRoute)
app.use('/orders', orderRoutes)

const startApp = async () => {
  const queueNameCoordinator = 'coordinator_queue'

  const { channel } = await setupMediator([queueNameCoordinator])

  CoordinatorService.startListening(channel, queueNameCoordinator)
}

startApp()

/**
 * Server Activation
 */
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

// SOCKET
export const socketManager = SocketManager.getInstance(server)

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception. Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

//Connect DB
mongoose
  .connect(process.env.DB_DATABASE || '')
  .then(() => {
    console.log('Connected to DB successfully')
  })
  .catch((err: Error) => {
    console.log('Failed to connect DB!')
  })

require('./models/LocationModel')

process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Rejection. Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
