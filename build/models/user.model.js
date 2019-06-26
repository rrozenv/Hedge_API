"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Schema
const userSchema = new mongoose_1.default.Schema({
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
    admin: Boolean
}, {
    timestamps: true
});
exports.userSchema = userSchema;
const UserModel = mongoose_1.default.model('User', userSchema);
exports.UserModel = UserModel;
