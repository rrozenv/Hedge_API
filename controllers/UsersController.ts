import express from 'express';
import IToken from '../interfaces/token.interface'
import IUser from '../interfaces/user.interface'
import Joi from 'Joi';
import jwt from 'jsonwebtoken';
import config from 'config';
import { UserModel, UserType } from '../models/user.model'
import IController from '../interfaces/controller.interface';

class UsersController implements IController {
    public path = '/users';
    public router = express.Router({});
   
    // MARK: - Constructor
    constructor() {
      this.initializeRoutes();
    }
   
    private initializeRoutes() {
      this.router.post(this.path, this.createUser);
      this.router.post(`${this.path}/login`, this.loginUser);
    }
   
    // MARK: - Create User
    private createUser = async (req: any, res: any) => {
        const { error } = this.validateUser(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        const { name, phoneNumber, admin } = req.body
        let user = await UserModel.findOne({ phoneNumber: phoneNumber });

        if (!user) { 
            user = new UserModel({ 
                name: name, 
                phoneNumber: phoneNumber, 
                admin: admin 
            });
            await user.save();
        } 
  
        const tokenData = this.createAuthToken(user);
        res.header('Set-Cookie', this.createCookie(tokenData));
        res.send(user);
    }

    // MARK: - Login User
    private loginUser = async (req: any, res: any) => { 
        const { phoneNumber } = req.body

        let user = await UserModel.findOne({ phoneNumber: phoneNumber });
      
        if (!user) { 
          return res.status(400).send({ message: 'User does not exist.' });
        } 
        
        const tokenData = this.createAuthToken(user);
        res.header('Set-Cookie', this.createCookie(tokenData));
        res.send(user);
    } 

    // MARK: - Auth token creation 
    private createAuthToken = (user: UserType): IToken => { 
        const expiresIn = 60 * 60; // an hour
        const secret: string = config.get('jwtKey');
    
        return {
            expiresIn,
            token: jwt.sign({ _id: user._id, admin: user.admin }, secret, { expiresIn }),
        };
    }

    private createCookie(tokenData: IToken): string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
  
    // MARK: - User body validation 
    private validateUser = (user: IUser) => {
        const schema = {
          name: Joi.string().min(1).max(100).required(),
          phoneNumber: Joi.string().required(),
          admin: Joi.boolean()
        };
    
        return Joi.validate(user, schema);
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