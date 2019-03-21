// Dependencies
import express from 'express';
import Joi from 'Joi';
import jwt from 'jsonwebtoken';
import config from 'config';
// Interfaces
import IToken from '../interfaces/token.interface'
import IUser from '../interfaces/user.interface'
import IController from '../interfaces/controller.interface';
// Models
import { UserModel, UserType } from '../models/user.model'
// Services
import TwilioService from '../services/TwilioService';

// MARK: - UsersController
class UsersController implements IController {
    
    // MARK: - Properties
    public path = '/users';
    public router = express.Router({});
    private twilio_service: TwilioService;
   
    // MARK: - Constructor
    constructor() {
      this.twilio_service = new TwilioService();
      this.initializeRoutes();
    }
   
    private initializeRoutes() {
      this.router.post(this.path, this.createUser);
      this.router.post(`${this.path}/login`, this.loginUser);
      this.router.post(`${this.path}/sendPhoneVerificationCode`, this.sendVerificationCode);
      this.router.post(`${this.path}/validatePhoneVerificationCode`, this.validateVerificationCode);
    }

    /// ** ---- POST ROUTES ---- **
    // MARK: - Create User
    private createUser = async (req: any, res: any) => {
        // Errors
        const { error } = this.validateCreate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        // Find user if exists
        const { name, phoneNumber, admin } = req.body
        let user = await UserModel.findOne({ phoneNumber: phoneNumber });

        // Create new user if doesn't exist 
        if (!user) { 
            user = new UserModel({ 
                name: name, 
                phoneNumber: phoneNumber, 
                admin: admin 
            });
            await user.save();
        } 
  
        // Return user with token in headers
        const tokenData = this.createAuthToken(user);
        res.set(this.createHeadersWith(tokenData));
        res.send(user);
    }

    // MARK: - Login User
    private loginUser = async (req: any, res: any) => { 
        // Errors
        const { error } = this.validateLogin(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        // Find user
        const { phoneNumber } = req.body
        let user = await UserModel.findOne({ phoneNumber: phoneNumber });
        if (!user) return res.status(400).send({ message: 'User does not exist.' });
        
        // Return user with token in headers
        const tokenData = this.createAuthToken(user);
        res.set(this.createHeadersWith(tokenData));
        res.send(user);
    } 

    // MARK: - Send phone verification code 
    private sendVerificationCode = async (req: any, res: any) => { 
      const { via, country_code, phone_number } = req.body
      const response = await this.twilio_service.sendVerificationCodeTo(phone_number, country_code, via)
      res.send(response);
    }; 

    // MARK: - Validate verification code 
    private validateVerificationCode = async (req: any, res: any) => { 
      const { via, country_code, phone_number } = req.body
      const response = await this.twilio_service.validateVerificationCode(phone_number, country_code, via);
      res.send(response);
    }; 

    /// ** ---- HELPER METHODS ---- **
    // MARK: - Auth token creation 
    createAuthToken = (user: UserType): IToken => { 
        const expiresIn = 60 * 60; // an hour
        const secret: string = config.get('jwtKey');
    
        return {
            expiresIn,
            token: jwt.sign({ _id: user._id, admin: user.admin, phoneNumber: user.phoneNumber }, secret, { expiresIn }),
        };
    }

    // MARK: - Auth headers creations
    createHeadersWith(tokenData: IToken): any {
        return { 
          'x-auth-token': tokenData.token,
          'token-expiration': tokenData.expiresIn
        }
    }
  
    /// ** ---- VALIDATION ---- **
    // MARK: - User body validation 
    private validateCreate = (user: IUser) => {
        const schema = {
          name: Joi.string().min(1).max(100).required(),
          phoneNumber: Joi.string().required(),
          admin: Joi.boolean()
        };
    
        return Joi.validate(user, schema);
    }

    // MARK: - User body validation 
    private validateLogin = (params: any) => {
      const schema = {
        phoneNumber: Joi.string().required(),
      };
  
      return Joi.validate(params, schema);
  }

    // MARK: - Token body validation 
    private validateToken = (token: string) => {
        const schema = {
          token: Joi.string().required()
        };
    
        return Joi.validate(token, schema);
    }
    
}

export default UsersController;