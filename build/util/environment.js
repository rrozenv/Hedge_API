"use strict";
module.exports = () => {
    process.env.NODE_ENV = "staging";
    process.env.H_JWT_KEY = "jwtKey";
    process.env.H_TWILIO_KEY = "twilioKey";
    process.env.DEBUG = "*";
    process.env.H_IEX_KEY = "iexKey";
};
