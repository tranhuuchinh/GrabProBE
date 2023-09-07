const amqp = require('amqplib/callback_api');
// const { Twilio } = require('twilio');
const Twilio = require('twilio');

const APIKey = '094B28ADAEF4D1BF03B00FB008A98A';
const SecretKey = 'E8AD239C02FF7E7AB0F22EB6FCC524';
const YourPhone = '0824.704.789';
// const YourPhone = '0901.888.484';
const Content = 'Welcome to esms.vn';

const SendContent = encodeURIComponent(Content);
const data = `http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?Phone=${YourPhone}&Content=${SendContent}&ApiKey=${APIKey}&SecretKey=${SecretKey}&IsUnicode=0&SmsType=8&RequestId=${YourPhone}`;

class SendSMSService {
    static startListening = async (channel, queueName) => {
        console.log('Send SMS Service is listening...');
        channel.consume(
            queueName,
            async (msg) => {
                if (msg && msg.content) {
                    const message = JSON.parse(msg.content.toString());
                    if (message.type === 'SEND_SMS') {
                        console.log('sms', message);
                        await this.sendSMS();
                        // await this.sendSMS(['84824704789'], 'Test sms', 2, '');

                        channel.ack(msg);
                    }
                }
            },
            { noAck: false }
        );
    };

    static sendSMS = async () => {
        const accountSid = 'AC530d5e90d802ddfd1b9e32e6fe476fee';
        const authToken = 'b43663c1bbe19e3046fc9ee659a3f1cb';
        const client = new Twilio(accountSid, authToken);

        client.messages
            .create({
                from: '+12565884188',
                to: '+84377023495',
                body: 'Đã tìm được tài xế  ',
            })
            .then((message) => console.log(message.sid))
            .catch((error) => console.log(error));
    };
}

module.exports = SendSMSService;
