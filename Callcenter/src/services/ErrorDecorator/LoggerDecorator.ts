import { Logger } from './Logger'
import Logstash from 'logstash-client'

const logstash = new Logstash({
  host: 'logstash.example.org',
  port: 9600
})

abstract class LoggerDecorator implements Logger {
  protected logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  abstract log(message: string): void
}

// Decorator cho log lỗi
export class ErrorLoggerDecorator extends LoggerDecorator {
  log(message: string) {
    this.logger.log('[ERROR] ' + message)
  }
}

export class WarningLoggerDecorator extends LoggerDecorator {
  log(message: string) {
    this.logger.log('[WARNING] ' + message)
  }
}

export class InfoLoggerDecorator extends LoggerDecorator {
  log(message: string) {
    this.logger.log('[INFO] ' + message)
  }
}
export class DebugLoggerDecorator extends LoggerDecorator {
  log(message: string) {
    this.logger.log('[DEBUG] ' + message)
  }
}
