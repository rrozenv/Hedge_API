"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const quote_schema_1 = __importDefault(require("./quote.schema"));
const basicStockSchema = joi_1.default.object().keys({
    symbol: joi_1.default.string().min(1).max(5).required(),
    imageUrl: joi_1.default.string().min(1),
    sector: joi_1.default.string().valid('technology', 'energy').required(),
});
exports.basicStockSchema = basicStockSchema;
const stockWithQuoteSchema = basicStockSchema
    .concat(joi_1.default.object().keys({ quote: quote_schema_1.default.required() }));
exports.stockWithQuoteSchema = stockWithQuoteSchema;
