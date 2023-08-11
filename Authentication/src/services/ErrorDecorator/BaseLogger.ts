import { Logger } from './Logger'
import fs from 'fs'
import path from 'path'
import { format } from 'date-fns'

export class BaseLogger implements Logger {
  log(message: string) {
    console.log(message)

    const logFilePath = path.join(__dirname, '../../logs/logs.log')
    const timestamp = `${format(new Date(), 'dd-MM-yyyy\tss:mm:HH')}`
    const logMessage = `${timestamp}: ${message}\n`

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing to logs.log:', err)
      }
    })
  }
}
