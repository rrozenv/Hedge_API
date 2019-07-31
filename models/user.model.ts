import mongoose from 'mongoose';
import IUser from '../interfaces/user.interface';
import { subscriptionSchema } from '../models/subscription.model';
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
  status: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  subscription: {
    type: subscriptionSchema,
    required: true
  },
  apnToken: {
    type: String,
    required: false
  },
  notificationsEnabled: {
    type: Boolean,
    required: true,
    default: false
  },
  admin: Boolean
}, {
    timestamps: true
  });

// Model
type UserType = IUser & mongoose.Document;
const UserModel = mongoose.model<UserType>('User', userSchema)

// Exports
export {
  userSchema,
  UserModel,
  UserType,
};