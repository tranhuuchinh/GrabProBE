/**
 * Required External Modules
 */
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import customerRoutes from '~/routes/customerRoutes'
import messagesRoutes from '~/routes/messagesRoutes'
import boxchatRoutes from '~/routes/boxchatRoute'
import orderRoutes from '~/routes/orderRoutes'
import billRoutes from '~/routes/billsRoute'
import salesRoute from '~/routes/salesRoute'
import informsRoute from '~/routes/informsRoute'
import paymentsRoute from '~/routes/paymentsRoute'
import SocketManager from './services/socket'
import { setupMediator } from './services/ChannelService/mediator'
import CustomerStatusService from './services/ChannelService/CustomerStatusService'

dotenv.config()

/**
 * App Variables
 */
const PORT: number = 3001

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
app.use('/customer', customerRoutes)
app.use('/messages', messagesRoutes)
app.use('/orders', orderRoutes)
app.use('/bills', billRoutes)
app.use('/sales', salesRoute)
app.use('/informs', informsRoute)
app.use('/payments', paymentsRoute)
app.use('/boxchat', boxchatRoutes)

const startApp = async () => {
  const queueNameCustomer = 'customer_queue'

  const { channel } = await setupMediator([queueNameCustomer])

  CustomerStatusService.startListening(channel, queueNameCustomer)
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
