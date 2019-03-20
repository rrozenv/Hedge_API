"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
exports.default = (function (req, res, next) {
    var token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    try {
        var decoded = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
});
