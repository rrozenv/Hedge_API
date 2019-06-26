"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const createHedgeFundSchema = joi_1.default.object().keys({
    name: joi_1.default.string().min(1).required(),
    manager: joi_1.default.string().min(1).required(),
});
exports.createHedgeFundSchema = createHedgeFundSchema;
const addPositionsSchema = joi_1.default.object().keys({
    stockSymbol: joi_1.default.string().min(1).required(),
    marketValue: joi_1.default.number().required(),
    purchaseDate: joi_1.default.date().required()
});
exports.addPositionsSchema = addPositionsSchema;
