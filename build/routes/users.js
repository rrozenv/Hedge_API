"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router({});
// router.post('/', async (req, res) => {
//     const { error } = validateUser(req.body); 
//     if (error) return res.status(400).send(error.details[0].message);
//     const { name, phoneNumber } = req.body
//     let user = await User.findOne({ phoneNumber: phoneNumber });
//     if (!user) { 
//       user = new User({ name: name, phoneNumber: phoneNumber });
//       await user.save();
//     } 
//     const token = user.generateAuthToken();
//     return res.header('x-auth-token', token).send(user);
//  });
