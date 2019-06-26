"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const Error_1 = __importDefault(require("../util/Error"));
exports.default = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(404).send(new Error_1.default('Token Expired', 'Please login again.'));
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
};
