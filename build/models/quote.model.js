"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var quoteSchema = new mongoose_1.default.Schema({
    symbol: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    companyName: {
        type: String,
        required: false,
        minlength: 0,
        maxlength: 50
    },
    latestPrice: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    changePercent: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 50
    },
});
exports.quoteSchema = quoteSchema;
var QuoteModel = mongoose_1.default.model('IEXQuote', quoteSchema);
exports.QuoteModel = QuoteModel;
