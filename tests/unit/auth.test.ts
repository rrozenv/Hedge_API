require('../../environment')();
import UsersController from '../../controllers/UsersController';
import { UserModel, UserType } from '../../models/user.model';
import jwt from 'jsonwebtoken';
import config from 'config';
import mongoose from 'mongoose';
import IToken from '../../interfaces/token.interface';
import auth from '../../middleware/auth';

describe('usersController.createAuthToken', () => {

  let user: UserType;
  let userPayload: any;
  let tokenData: IToken;

  beforeEach(() => {
    const usersController = new UsersController();
    userPayload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      phoneNumber: '123456789',
      admin: true
    }
    user = new UserModel(userPayload);
    tokenData = usersController.createAuthToken(user);
  })

  it('should return a valid JWT', () => {
    const decoded = jwt.verify(tokenData.token, config.get('jwtKey'));
    expect(decoded).toEqual(expect.objectContaining(userPayload));
  });

  it('should populate req.user with the payload of a valid JWT', () => {
    const req = {
      header: jest.fn().mockReturnValue(tokenData.token),
      user: null
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toEqual(expect.objectContaining(userPayload));
  });

});