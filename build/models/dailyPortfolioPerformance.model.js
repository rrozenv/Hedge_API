"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dailyPortfolioPerformanceModelSchema = new mongoose_1.default.Schema({
    portfolio: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Portfolio',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    performance: {
        type: Number,
        required: true
    }
});
const DailyPortfolioPerformanceModel = mongoose_1.default.model('DailyPortfolioPerformance', dailyPortfolioPerformanceModelSchema);
exports.DailyPortfolioPerformanceModel = DailyPortfolioPerformanceModel;
