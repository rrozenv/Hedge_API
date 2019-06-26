"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.default = joi_1.default.object().keys({
    symbol: joi_1.default.string().min(1).max(5).required(),
    companyName: joi_1.default.string().min(1),
    latestPrice: joi_1.default.number().positive().required(),
    changePercent: joi_1.default.number().required(),
});
