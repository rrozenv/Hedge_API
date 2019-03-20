"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var quote_model_1 = require("./quote.model");
var stockSchema = new mongoose_1.default.Schema({
    imageUrl: {
        type: String,
        required: false,
        minlength: 0,
        maxlength: 10000
    },
    sector: {
        type: String,
        required: true,
        enum: ['technology', 'energy', 'healthcare'],
        maxlength: 10000
    },
    quote: quote_model_1.quoteSchema
});
exports.stockSchema = stockSchema;
var StockModel = mongoose_1.default.model('Stock', stockSchema);
exports.StockModel = StockModel;
