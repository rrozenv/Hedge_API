// Dependencies
import express from 'express';
import Joi from 'Joi';
import jwt from 'jsonwebtoken';
import config from 'config';
import auth from '../middleware/auth';
// Interfaces
import IToken from '../interfaces/token.interface'
import IUser from '../interfaces/user.interface'
import IController from '../interfaces/controller.interface';
// Models
import { UserModel, UserType } from '../models/user.model'
// Services
import TwilioService from '../services/TwilioService';
import APIError from '../util/Error';
import moment = require('moment');

// MARK: - UsersController
class UsersController implements IController {

  // MARK: - Properties
  public path = '/users';
  public router = express.Router({});
  private twilio_service: TwilioService;
  private featureFlags = {
    watchlistEnabled: false
  }

  // MARK: - Constructor
  constructor() {
    this.twilio_service = new TwilioService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // GET
    this.router.get(`${this.path}/me`, [auth], this.getCurrentUser);

    // POST
    this.router.post(this.path, this.createUser);
    this.router.post(`${this.path}/login`, this.loginUser);
    this.router.post(`${this.path}/sendCode`, this.sendVerificationCode);
    this.router.post(`${this.path}/validateCode`, this.validateVerificationCode);
  }

  /// ** ---- GET ROUTES ---- **

  // MARK: - Get current user
  private getCurrentUser = async (req: any, res: any) => {
    // Find user from token
    const user = await UserModel.findById(req.user);
    if (!user) return res.status(400).send(new APIError('Bad Request', 'User does not exist.'));

    // Send response
    res.send({
      ...user.toJSON(),
      featureFlags: this.featureFlags
    });
  }

  /// ** ---- POST ROUTES ---- **

  // MARK: - Create new user
  private createUser = async (req: any, res: any) => {
    // Errors
    const { error } = this.validateCreate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find user if exists
    const { name, phone, admin } = req.body
    let user = await UserModel.findOne({ phoneNumber: phone });

    // Create new user if doesn't exist 
    if (!user) {
      user = new UserModel({
        name: name,
        phoneNumber: phone,
        status: 'trial',
        admin: admin
      });
      await user.save();
    }

    // Return user with token in headers
    const tokenData = this.createAuthToken(user);
    res.set(this.createHeadersWith(tokenData));

    res.send({
      user: {
        ...user.toJSON(),
        featureFlags: this.featureFlags
      },
      token: tokenData.token,
      tokenExp: tokenData.expiresIn
    });
  }

  // MARK: - Login User
  private loginUser = async (req: any, res: any) => {
    // Errors
    const { error } = this.validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find user
    const { phone } = req.body
    let user = await UserModel.findOne({ phoneNumber: phone });
    if (!user) return res.status(400).send({ message: 'User does not exist.' });

    // Return user with token in headers
    const tokenData = this.createAuthToken(user);
    res.set(this.createHeadersWith(tokenData));
    res.send({
      user: {
        ...user.toJSON(),
        featureFlags: {
          watchlistEnabled: false
        }
      },
      token: tokenData.token,
      tokenExp: tokenData.expiresIn
    });
  }

  // MARK: - Send phone verification code 
  private sendVerificationCode = async (req: any, res: any) => {
    const { via, country_code, phone_number } = req.body
    try {
      const response = await this.twilio_service.sendVerificationCodeTo(phone_number, country_code, via)
      res.send(response);
    } catch (err) {
      res.status(400).send(
        new APIError('Bad Request', `Error sending code: ${err}`)
      );
    }
  };

  // MARK: - Validate verification code 
  private validateVerificationCode = async (req: any, res: any) => {
    const { code, country_code, phone_number } = req.body
    try {
      const response = await this.twilio_service.validateVerificationCode(phone_number, country_code, code);
      res.send(response);
    } catch (err) {
      console.log(err);
      res.status(400).send(
        new APIError('Bad Request', `Error verifying code: ${err}`)
      );
    }
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
      phone: Joi.string().required(),
      admin: Joi.boolean()
    };

    return Joi.validate(user, schema);
  }

  // MARK: - User body validation 
  private validateLogin = (params: any) => {
    const schema = {
      phone: Joi.string().required(),
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