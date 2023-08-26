const amqp = require('amqplib/callback_api');
const util = require('util');

const EXCHANGE_NAME = 'mediator_exchange';

let connection = null;
let channel = null;

const queueMapping = {};

const setupMediator = async (queues) => {
    connection = await new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL || 'amqp://grab:grab@localhost', (err, conn) => {
            if (err) {
                reject(err);
            } else {
                resolve(conn);
            }
        });
    });

    channel = await new Promise((resolve, reject) => {
        if (connection) {
            connection.createChannel((err, ch) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(ch);
                }
            });
        }
    });

    await new Promise((resolve, reject) => {
        if (channel) {
            channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }
    });

    async function createQueue(queueName) {
        const queueInfo = await new Promise((resolve, reject) => {
            if (channel) {
                channel.assertQueue(queueName, { exclusive: false }, (err, q) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(q);
                    }
                });
            }
        });

        await new Promise((resolve, reject) => {
            if (channel) {
                channel.bindQueue(queueInfo.queue, EXCHANGE_NAME, '', {}, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });

        return queueInfo.queue;
    }

    for (let i = 0; i < queues.length; i++) {
        queueMapping[queues[i]] = createQueue(queues[i]);
    }

    return { connection, channel };
};

const publishToMediator = (message) => {
    if (channel) {
        channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify(message)));
    }
};

const sendToQueue = (queueName, message) => {
    if (channel) {
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    }
};

module.exports = {
    setupMediator,
    publishToMediator,
    sendToQueue,
};
