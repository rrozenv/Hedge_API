"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const superagent_1 = __importDefault(require("superagent"));
// MARK: - Constants
const sendCodePath = "/phones/verification/start";
const verifyCodePath = "/phones/verification/check";
const baseUrl = config_1.default.get('twilio-base-url');
const apiKey = config_1.default.get('twilioKey');
class TwilioService {
    // MARK: - Send verification code 
    async sendVerificationCodeTo(phoneNumber, countryCode, via) {
        const payload = await superagent_1.default
            .post(`${baseUrl}${sendCodePath}`)
            .send({ phone_number: phoneNumber, country_code: countryCode, via: via })
            .set('X-Authy-API-Key', 'hy73bYkNMyWpgCFAWaKGCDDlFDkTxy3u')
            .set('Accept', 'application/json');
        return {
            carrier: payload.body.carrier,
            is_cellphone: payload.body.is_cellphone,
            message: payload.body.message,
            seconds_to_expire: payload.body.seconds_to_expire,
            uuid: payload.body.uuid,
            success: payload.body.success
        };
    }
    // MARK: - Validate verification code 
    async validateVerificationCode(phoneNumber, countryCode, code) {
        const payload = await superagent_1.default
            .get(`${baseUrl}${verifyCodePath}`)
            .query({ phone_number: phoneNumber, country_code: countryCode, verification_code: code })
            .set('X-Authy-API-Key', 'hy73bYkNMyWpgCFAWaKGCDDlFDkTxy3u');
        return {
            message: payload.body.message,
            success: payload.body.success
        };
    }
    ;
}
exports.default = TwilioService;
