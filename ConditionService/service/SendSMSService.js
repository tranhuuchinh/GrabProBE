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
        const authToken = '8353a13c9fcc35eeb6a90530d09994dc';
        const client = new Twilio(accountSid, authToken);

        client.messages
            .create({
                from: '+12565884188',
                to: '+84377023495',
                body: 'Con Chó Chính  ',
            })
            .then((message) => console.log(message.sid))
            .catch((error) => console.log(error));
    };

    // Vonage
    // static sendSMS = async () => {
    //     await vonage.sms
    //         .send({ to, from, text })
    //         .then((resp) => {
    //             console.log('Message sent successfully');
    //             console.log(resp);
    //         })
    //         .catch((err) => {
    //             console.log('There was an error sending the messages.');
    //             console.error(err);
    //         });
    // };

    // SpeedSMS
    // static sendSMS = async (phones, content, type, sender) => {
    //     const url = 'api.speedsms.vn';
    //     const params = JSON.stringify({
    //         to: phones,
    //         content: content,
    //         sms_type: type,
    //         sender: sender,
    //     });

    //     const buf = Buffer.from(ACCESS_TOKEN + ':x'); // Sử dụng Buffer.from() thay vì new Buffer()
    //     const auth = 'Basic ' + buf.toString('base64');
    //     const options = {
    //         hostname: url,
    //         port: 443,
    //         path: '/index.php/sms/send',
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: auth,
    //         },
    //     };

    //     const req = https.request(options, function (res) {
    //         res.setEncoding('utf8');
    //         let body = ''; // Khởi tạo body là một chuỗi rỗng
    //         res.on('data', function (d) {
    //             body += d;
    //         });
    //         res.on('end', function () {
    //             console.log('Response body:', body); // In ra nội dung của phản hồi
    //             try {
    //                 const json = JSON.parse(body);
    //                 if (json.status === 'success') {
    //                     console.log('send sms success');
    //                 } else {
    //                     console.log('send sms failed ' + body);
    //                 }
    //             } catch (error) {
    //                 console.error('Failed to parse JSON:', error);
    //             }
    //         });
    //     });

    //     req.on('error', function (e) {
    //         console.log('send sms failed: ' + e);
    //     });

    //     req.write(params);
    //     req.end();
    // };

    // eSMS
    // static sendSMS = async () => {
    //     try {
    //         const response = await axios.get(data);

    //         const obj = response.data;
    //         console.log(obj);
    //         if (obj.CodeResult === 100) {
    //             console.log('CodeResult:', obj.CodeResult);
    //             console.log('CountRegenerate:', obj.CountRegenerate);
    //             console.log('SMSID:', obj.SMSID);
    //         } else {
    //             console.log('ErrorMessage:', obj.ErrorMessage);
    //         }
    //     } catch (error) {
    //         console.error('Error:', error.message);
    //     }
    // };
}

module.exports = SendSMSService;

//send test sms
//sendSMS(['your phone number'], "test ná»™i dung sms", 2, '');
