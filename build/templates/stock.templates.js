"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stock_model_1 = require("../models/stock.model");
const stockTemplates = [
    new stock_model_1.StockModel({
        symbol: "AAPL",
        companyName: "Apple Inc",
        imageUrl: '',
        sector: 'technology',
        quote: {
            latestPrice: 100.0,
            changePercent: 2.0
        }
    }),
    new stock_model_1.StockModel({
        imageUrl: '',
        sector: 'technology',
        symbol: "FB",
        companyName: "Facebook",
        quote: {
            latestPrice: 100.0,
            changePercent: 2.0
        }
    }),
    new stock_model_1.StockModel({
        symbol: "TSLA",
        companyName: "Tesla Inc",
        imageUrl: '',
        sector: 'technology',
        quote: {
            latestPrice: 100.0,
            changePercent: 2.0
        }
    })
];
exports.default = stockTemplates;
