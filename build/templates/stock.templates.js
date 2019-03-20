"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stock_model_1 = require("../models/stock.model");
var stockTemplates = [
    new stock_model_1.StockModel({
        imageUrl: '',
        sector: 'technology',
        quote: {
            symbol: "AAPL",
            companyName: "Apple Inc",
            latestPrice: 100.0,
            changePercent: 2.0
        }
    }),
    new stock_model_1.StockModel({
        imageUrl: '',
        sector: 'technology',
        quote: {
            symbol: "FB",
            companyName: "Facebook",
            latestPrice: 100.0,
            changePercent: 2.0
        }
    }),
    new stock_model_1.StockModel({
        imageUrl: '',
        sector: 'technology',
        quote: {
            symbol: "TSLA",
            companyName: "Tesla Inc",
            latestPrice: 100.0,
            changePercent: 2.0
        }
    })
];
exports.default = stockTemplates;
