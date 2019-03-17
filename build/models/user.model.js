"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Joi_1 = __importDefault(require("Joi"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
// Schema
var userSchema = new mongoose_1.default.Schema({
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
exports.userSchema = userSchema;
// Auth token creation 
var createAuthToken = function (user) {
    var expiresIn = 60 * 60; // an hour
    var secret = config_1.default.get('jwtKey');
    return {
        expiresIn: expiresIn,
        token: jsonwebtoken_1.default.sign({ _id: user._id, admin: user.admin }, secret, { expiresIn: expiresIn }),
    };
};
exports.createAuthToken = createAuthToken;
var UserModel = mongoose_1.default.model('User', userSchema);
exports.UserModel = UserModel;
// Validation 
var validateUser = function (user) {
    var schema = {
        name: Joi_1.default.string().min(1).max(100).required(),
        phoneNumber: Joi_1.default.string().required(),
        admin: Joi_1.default.boolean()
    };
    return Joi_1.default.validate(user, schema);
};
exports.validateUser = validateUser;
var validateToken = function (token) {
    var schema = {
        token: Joi_1.default.string().required()
    };
    return Joi_1.default.validate(token, schema);
};
exports.validateToken = validateToken;
