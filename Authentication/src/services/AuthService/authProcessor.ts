// auth-processor.ts
import { AuthStrategy } from './authStrategies'

class AuthProcessor {
  private strategy: AuthStrategy

  constructor(strategy: AuthStrategy) {
    this.strategy = strategy
  }

  async login(data: any, role: any): Promise<any> {
    return this.strategy.login(data, role)
  }
}

export default AuthProcessor
