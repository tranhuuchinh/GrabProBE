/**
 * Required External Modules
 */
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
import homeAdminRoute from '~/routes/homeAdminRoute'

dotenv.config()

/**
 * App Variables
 */
const PORT: number = 3000

const app = express()

/**
 *  App Configuration
 */
app.use(express.json({ limit: '10mb' }))

/**
 * ROUTES
 */
app.use('/user', userRoutes)
app.use('/customer', customerRoutes)
app.use('/messages', messagesRoutes)
app.use('/orders', orderRoutes)
app.use('/bills', billRoutes)
app.use('/sales', salesRoute)
app.use('/informs', informsRoute)
app.use('/payments', paymentsRoute)
app.use('/homeAdmin', homeAdminRoute)

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
