"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quoteSchema = new mongoose_1.default.Schema({
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
const QuoteModel = mongoose_1.default.model('IEXQuote', quoteSchema);
exports.QuoteModel = QuoteModel;
