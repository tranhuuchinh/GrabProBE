/**
 * Required External Modules
 */
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoutes from '~/routes/userRoutes'
import customerRoutes from '~/routes/customerRoutes'
import messagesRoutes from '~/routes/messagesRoutes'
import orderRoutes from '~/routes/orderRoutes'
import billRoutes from '~/routes/billsRoute'
import salesRoute from '~/routes/salesRoute'
import informsRoute from '~/routes/informsRoute'
import paymentsRoute from '~/routes/paymentsRoute'
import driverRoute from '~/routes/driverRoute'
import homeAdminRoute from '~/routes/homeAdminRoute'
import callcenterRoute from '~/routes/callcenterRoutes'
import { setupMediator } from './services/CallCenterService/mediator'
import { rideStatusService } from './services/CallCenterService/rideStatusService'
import GeolocationService from './services/CallCenterService/GeolocationService'

dotenv.config()

/**
 * App Variables
 */
const PORT: number = 3000

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
app.use('/messages', messagesRoutes)
app.use('/orders', orderRoutes)
app.use('/bills', billRoutes)
app.use('/sales', salesRoute)
app.use('/informs', informsRoute)
app.use('/payments', paymentsRoute)
app.use('/homeAdmin', homeAdminRoute)
app.use('/callcenter', callcenterRoute)

const startApp = async () => {
  const queueNameRideStatus = 'ride_status_queue'
  const queueNameGeolocation = 'geolocation_queue'

  const { channel } = await setupMediator([queueNameRideStatus, queueNameGeolocation]) // Khởi tạo kết nối RabbitMQ

  rideStatusService.startListening(channel, queueNameRideStatus)
  GeolocationService.startListening(channel, queueNameGeolocation)
}

startApp()

/**
 * Server Activation
 */
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

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