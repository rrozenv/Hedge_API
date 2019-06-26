"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dailyPortfolioPerformance_model_1 = require("../models/dailyPortfolioPerformance.model");
const moment_1 = __importDefault(require("moment"));
const dailyPortfolioPerformanceTemplates = (portfolio) => {
    return [
        new dailyPortfolioPerformance_model_1.DailyPortfolioPerformanceModel({
            portfolio: portfolio._id,
            date: moment_1.default().subtract(1, 'months').endOf('month').toDate(),
            performance: 10.0
        }),
        new dailyPortfolioPerformance_model_1.DailyPortfolioPerformanceModel({
            portfolio: portfolio._id,
            date: moment_1.default().subtract(2, 'months').endOf('month').toDate(),
            performance: 20.0
        }),
        new dailyPortfolioPerformance_model_1.DailyPortfolioPerformanceModel({
            portfolio: portfolio._id,
            date: moment_1.default().subtract(3, 'months').endOf('month').toDate(),
            performance: 30.0
        }),
        new dailyPortfolioPerformance_model_1.DailyPortfolioPerformanceModel({
            portfolio: portfolio._id,
            date: moment_1.default().subtract(10, 'months').endOf('month').toDate(),
            performance: 100.0
        })
    ];
};
exports.default = dailyPortfolioPerformanceTemplates;
