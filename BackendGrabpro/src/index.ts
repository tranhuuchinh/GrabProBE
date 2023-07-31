/**
 * Required External Modules
 */
import express from 'express'
import test from '../src/routes/test'

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
