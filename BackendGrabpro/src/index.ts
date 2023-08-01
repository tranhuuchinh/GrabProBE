/**
 * Required External Modules
 */
import express from 'express'
import test from '../src/routes/test'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

/**
 * App Variables
 */
const PORT: number = 4000

const app = express()
/**
 *  App Configuration
 */
app.use(express.json())
app.use('/', test)
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

dotenv.config({ path: './.env' })
console.log(process.env.DB_DATABASE)

//Connect DB

const databaseUrl = 'mongodb+srv://KhoiAndy:M9wDFTznOUl5cYxw@cluster0.8jlbw0s.mongodb.net/Grab' ?? ''
mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log('Connected to DB successfully')
  })
  .catch((err) => {
    console.log('Failed to connect DB!')
  })

process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Rejection. Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
