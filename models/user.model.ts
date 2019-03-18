import mongoose from 'mongoose';
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

// Model
type UserType = IUser & mongoose.Document;
const UserModel = mongoose.model<UserType>('User', userSchema)

// Exports
export { 
    userSchema, 
    UserModel,  
    UserType,
};