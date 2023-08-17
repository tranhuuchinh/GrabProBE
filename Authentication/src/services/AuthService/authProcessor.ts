// auth-processor.ts
import { AuthStrategy } from './authStrategies'

class AuthProcessor {
  private strategy: AuthStrategy

  constructor(strategy: AuthStrategy) {
    this.strategy = strategy
  }

  async login(data: any): Promise<any> {
    return this.strategy.login(data)
  }
}

export default AuthProcessor
