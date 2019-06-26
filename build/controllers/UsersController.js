"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = __importDefault(require("express"));
const Joi_1 = __importDefault(require("Joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const auth_1 = __importDefault(require("../middleware/auth"));
// Models
const user_model_1 = require("../models/user.model");
// Services
const TwilioService_1 = __importDefault(require("../services/TwilioService"));
const Error_1 = __importDefault(require("../util/Error"));
// MARK: - UsersController
class UsersController {
    // MARK: - Constructor
    constructor() {
        // MARK: - Properties
        this.path = '/users';
        this.router = express_1.default.Router({});
        this.featureFlags = {
            watchlistEnabled: false
        };
        /// ** ---- GET ROUTES ---- **
        // MARK: - Get current user
        this.getCurrentUser = async (req, res) => {
            // Find user from token
            const user = await user_model_1.UserModel.findById(req.user);
            if (!user)
                return res.status(400).send(new Error_1.default('Bad Request', 'User does not exist.'));
            // Send response
            res.send(Object.assign({}, user.toJSON(), { featureFlags: this.featureFlags }));
        };
        /// ** ---- POST ROUTES ---- **
        // MARK: - Create new user
        this.createUser = async (req, res) => {
            // Errors
            const { error } = this.validateCreate(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            // Find user if exists
            const { name, phone, admin } = req.body;
            let user = await user_model_1.UserModel.findOne({ phoneNumber: phone });
            // Create new user if doesn't exist 
            if (!user) {
                user = new user_model_1.UserModel({
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
                user: Object.assign({}, user.toJSON(), { featureFlags: this.featureFlags }),
                token: tokenData.token,
                tokenExp: tokenData.expiresIn
            });
        };
        // MARK: - Login User
        this.loginUser = async (req, res) => {
            // Errors
            const { error } = this.validateLogin(req.body);
            if (error)
                return res.status(400).send(error.details[0].message);
            // Find user
            const { phone } = req.body;
            let user = await user_model_1.UserModel.findOne({ phoneNumber: phone });
            if (!user)
                return res.status(400).send({ message: 'User does not exist.' });
            // Return user with token in headers
            const tokenData = this.createAuthToken(user);
            res.set(this.createHeadersWith(tokenData));
            res.send({
                user: Object.assign({}, user.toJSON(), { featureFlags: {
                        watchlistEnabled: false
                    } }),
                token: tokenData.token,
                tokenExp: tokenData.expiresIn
            });
        };
        // MARK: - Send phone verification code 
        this.sendVerificationCode = async (req, res) => {
            const { via, country_code, phone_number } = req.body;
            try {
                const response = await this.twilio_service.sendVerificationCodeTo(phone_number, country_code, via);
                res.send(response);
            }
            catch (err) {
                res.status(400).send(new Error_1.default('Bad Request', `Error sending code: ${err}`));
            }
        };
        // MARK: - Validate verification code 
        this.validateVerificationCode = async (req, res) => {
            const { code, country_code, phone_number } = req.body;
            try {
                const response = await this.twilio_service.validateVerificationCode(phone_number, country_code, code);
                res.send(response);
            }
            catch (err) {
                res.status(400).send(new Error_1.default('Bad Request', `Error verifying code: ${err}`));
            }
        };
        /// ** ---- HELPER METHODS ---- **
        // MARK: - Auth token creation 
        this.createAuthToken = (user) => {
            const expiresIn = 1209600; // 2 weeks
            const secret = config_1.default.get('jwtKey');
            return {
                expiresIn,
                token: jsonwebtoken_1.default.sign({
                    _id: user._id,
                    admin: user.admin,
                    phoneNumber: user.phoneNumber
                }, secret
                // { expiresIn } // MARK: - removing token expiration for now. 
                ),
            };
        };
        /// ** ---- VALIDATION ---- **
        // MARK: - User body validation 
        this.validateCreate = (user) => {
            const schema = {
                name: Joi_1.default.string().min(1).max(100).required(),
                phone: Joi_1.default.string().required(),
                admin: Joi_1.default.boolean()
            };
            return Joi_1.default.validate(user, schema);
        };
        // MARK: - User body validation 
        this.validateLogin = (params) => {
            const schema = {
                phone: Joi_1.default.string().required(),
            };
            return Joi_1.default.validate(params, schema);
        };
        // MARK: - Token body validation 
        this.validateToken = (token) => {
            const schema = {
                token: Joi_1.default.string().required()
            };
            return Joi_1.default.validate(token, schema);
        };
        this.twilio_service = new TwilioService_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // GET
        this.router.get(`${this.path}/me`, [auth_1.default], this.getCurrentUser);
        // POST
        this.router.post(this.path, this.createUser);
        this.router.post(`${this.path}/login`, this.loginUser);
        this.router.post(`${this.path}/sendCode`, this.sendVerificationCode);
        this.router.post(`${this.path}/validateCode`, this.validateVerificationCode);
    }
    // MARK: - Auth headers creations
    createHeadersWith(tokenData) {
        return {
            'x-auth-token': tokenData.token,
            'token-expiration': tokenData.expiresIn
        };
    }
}
exports.default = UsersController;
