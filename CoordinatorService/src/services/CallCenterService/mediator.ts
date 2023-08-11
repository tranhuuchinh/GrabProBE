import * as amqp from 'amqplib/callback_api'
import { promisify } from 'util'

const EXCHANGE_NAME = 'mediator_exchange'

let connection: amqp.Connection | null = null
let channel: amqp.Channel | null = null

const queueMapping: Record<string, any> = {}

export const setupMediator = async (queues: string[]) => {
  connection = await new Promise<amqp.Connection>((resolve, reject) => {
    amqp.connect('amqp://grab:grab@localhost', (err, conn) => {
      if (err) {
        reject(err)
      } else {
        resolve(conn)
      }
    })
  })

  channel = await new Promise<amqp.Channel>((resolve, reject) => {
    if (connection) {
      connection.createChannel((err, ch) => {
        if (err) {
          reject(err)
        } else {
          resolve(ch)
        }
      })
    }
  })

  await new Promise<void>((resolve, reject) => {
    if (channel) {
      channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    }
  })

  async function createQueue(queueName: string) {
    const queueInfo = await new Promise<amqp.Replies.AssertQueue>((resolve, reject) => {
      if (channel) {
        channel.assertQueue(queueName, { exclusive: false }, (err, q) => {
          if (err) {
            reject(err)
          } else {
            resolve(q)
          }
        })
      }
    })

    await new Promise<void>((resolve, reject) => {
      if (channel) {
        channel.bindQueue(queueInfo.queue, EXCHANGE_NAME, '', {}, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })

    return queueInfo.queue
  }

  for (let i = 0; i < queues.length; i++) {
    queueMapping[queues[i]] = createQueue(queues[i])
  }

  return { connection, channel }
}

export const publishToMediator = (message: any) => {
  if (channel) {
    channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify(message)))
  }
}

export const sendToQueue = (queueName: string, message: any) => {
  if (channel) {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
  }
}
