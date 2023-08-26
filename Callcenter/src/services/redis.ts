import Redis, { Redis as RedisClient } from 'ioredis'

export class RedisService {
  private static instance: RedisService
  private redis: RedisClient

  private constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379') || 6379,
      password: process.env.REDIS_PASSWORD || 'grab'
    })
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  public async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value)
  }

  public async get(key: string): Promise<string | null> {
    const result = await this.redis.get(key)
    return result
  }

  public async delete(key: string): Promise<number> {
    const deletedCount = await this.redis.del(key)
    return deletedCount
  }

  public async disconnect(): Promise<void> {
    await this.redis.quit()
  }
}

// async function main() {
//   const redisService = RedisService.getInstance()

//   try {
//     await redisService.set('myKey', 'Hello, Redis!')
//     const result = await redisService.get('myKey')
//     console.log(result)
//   } catch (error) {
//     console.error('Error:', error)
//   } finally {
//     await redisService.disconnect()
//   }
// }
