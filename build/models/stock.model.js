"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quote_model_1 = require("./quote.model");
const stockSchema = new mongoose_1.default.Schema({
    symbol: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    sector: {
        type: String,
        required: true,
        enum: ['technology', 'energy', 'healthcare', 'biotech'],
        maxlength: 10000
    },
    quote: {
        type: quote_model_1.quoteSchema,
        required: false
    }
});
exports.stockSchema = stockSchema;
const StockModel = mongoose_1.default.model('Stock', stockSchema);
exports.StockModel = StockModel;
