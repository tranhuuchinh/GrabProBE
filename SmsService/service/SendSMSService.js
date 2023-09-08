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
                        await this.sendSMS('Đơn hàng đã đặt, đang tìm tài xế');
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
        const accountSid = 'heheboy';
        const authToken = 'auth';
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
