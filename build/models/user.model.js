"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
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
}, {
    timestamps: true
});
exports.userSchema = userSchema;
var UserModel = mongoose_1.default.model('User', userSchema);
exports.UserModel = UserModel;
