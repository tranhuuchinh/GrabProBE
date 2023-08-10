import { Logger } from './Logger'

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
