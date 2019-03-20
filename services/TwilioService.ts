import config from 'config';
import request from 'superagent';
import ITwilioPhoneResponse from '../interfaces/twilioPhoneResponse.interface';
import ITwilioCodeResponse from '../interfaces/twilioCodeResponse.interface';

// MARK: - Constants
const sendCodePath = "/phones/verification/start";
const verifyCodePath = "/phones/verification/check";
const baseUrl = config.get('twilio-base-url');
const apiKey = config.get('twilioKey');

class TwilioService { 

    // MARK: - Send verification code 
    async sendVerificationCodeTo(phoneNumber: string, countryCode: string, via: string): Promise<ITwilioPhoneResponse> {
        const payload = await request
            .post(`${baseUrl}${sendCodePath}`)
            .send({ phone_number: phoneNumber, country_code: countryCode, via: via })
            .set({ 'X-Authy-API-Key': apiKey, Accept: 'application/json' })

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
    async validateVerificationCode(phoneNumber: string, countryCode: string, code: string): Promise<ITwilioCodeResponse> { 
        const payload = await request
            .get(`${baseUrl}`)
            .query({ phone_number: phoneNumber, country_code: countryCode, verification_code: code })

        return { 
            message: payload.body.message,
            success: payload.body.success
        };
    };

}

export default TwilioService;