const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const { setupMediator } = require('./service/mediator');
const SendSMSService = require('./service/SendSMSService');

const limiter = rateLimit({
    // limiter is now become a middleware function
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try this again in an hour!',
}); // define how many requests per IP we are going to allow in a certain of time

const app = express();
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: '10mb' }));

const startApp = async () => {
    const queueNameSMS = 'sms_queue';

    const { channel } = await setupMediator([queueNameSMS]);

    SendSMSService.startListening(channel, queueNameSMS);
};

startApp();

module.exports = app;
