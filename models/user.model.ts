import mongoose from 'mongoose';
import Joi from 'Joi';
import jwt from 'jsonwebtoken';
import config from 'config';
import IUser from '../interfaces/user.interface';
import IToken from '../interfaces/token.interface';

// Schema
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    admin: Boolean
});

// Auth token creation 
const createAuthToken = (user: UserType): IToken => { 
    const expiresIn = 60 * 60; // an hour
    const secret: string = config.get('jwtKey');
    
    return {
        expiresIn,
        token: jwt.sign({ _id: user._id, admin: user.admin }, secret, { expiresIn }),
    };
};
  
// Model
type UserType = IUser & mongoose.Document;
const UserModel = mongoose.model<UserType>('User', userSchema)

// Validation 
const validateUser = (user: IUser) => {
    const schema = {
      name: Joi.string().min(1).max(100).required(),
      phoneNumber: Joi.string().required(),
      admin: Joi.boolean()
    };
  
    return Joi.validate(user, schema);
}

const validateToken = (token: string) => {
    const schema = {
      token: Joi.string().required()
    };
  
    return Joi.validate(token, schema);
}

// Exports
export { 
    userSchema, 
    UserModel,  
    UserType,
    validateUser,
    validateToken,
    createAuthToken
};