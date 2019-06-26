"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('../../environment')();
const UsersController_1 = __importDefault(require("../../controllers/UsersController"));
const user_model_1 = require("../../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("../../middleware/auth"));
describe('usersController.createAuthToken', () => {
    let user;
    let userPayload;
    let tokenData;
    beforeEach(() => {
        const usersController = new UsersController_1.default();
        userPayload = {
            _id: new mongoose_1.default.Types.ObjectId().toHexString(),
            phoneNumber: '123456789',
            admin: true
        };
        user = new user_model_1.UserModel(userPayload);
        tokenData = usersController.createAuthToken(user);
    });
    it('should return a valid JWT', () => {
        const decoded = jsonwebtoken_1.default.verify(tokenData.token, config_1.default.get('jwtKey'));
        expect(decoded).toEqual(expect.objectContaining(userPayload));
    });
    it('should populate req.user with the payload of a valid JWT', () => {
        const req = {
            header: jest.fn().mockReturnValue(tokenData.token),
            user: null
        };
        const res = {};
        const next = jest.fn();
        auth_1.default(req, res, next);
        expect(req.user).toEqual(expect.objectContaining(userPayload));
    });
});
