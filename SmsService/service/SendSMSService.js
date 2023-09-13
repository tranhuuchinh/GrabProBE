const Twilio = require('twilio');

class SendSMSService {
    static startListening = async (channel, queueName) => {
        console.log('Send SMS Service is listening...');
        channel.consume(
            queueName,
            async (msg) => {
                if (msg && msg.content) {
                    const message = JSON.parse(msg.content.toString());
                    if (message.type === 'SEND_SMS') {
                        await this.sendSMS('Tài xế đang đến - Xe Airblack màu Đen - Biển số 56AA-01244');
                        channel.ack(msg);
                    } else if (message.type === 'DRIVER_FOUND_SMS') {
                        await this.sendSMS('Đã tìm thấy tài xế');
                        channel.ack(msg);
                    }
                }
            },
            { noAck: false }
        );
    };

    static sendSMS = async (content) => {
        const accountSid = 'AC530d5e90d802ddfd1b9e32e6fe476fee';
        const authToken = 'b43663c1bbe19e3046fc9ee659a3f1cb';
        const client = new Twilio(accountSid, authToken);

        client.messages
            .create({
                from: '+12565884188',
                to: '+84377023495',
                body: content,
            })
            .then((message) => console.log(message.sid))
            .catch((error) => console.log(error));
    };
}

module.exports = SendSMSService;
