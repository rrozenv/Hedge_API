"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var portfolio_model_1 = require("../models/portfolio.model");
var stock_templates_1 = __importDefault(require("./stock.templates"));
var portfolioTemplates = [
    new portfolio_model_1.PortfolioModel({
        name: "First Portfolio",
        description: "First Desc",
        stocks: stock_templates_1.default,
    }),
    new portfolio_model_1.PortfolioModel({
        name: "Second Portfolio",
        description: "Second Desc",
        stocks: stock_templates_1.default,
    }),
];
exports.default = portfolioTemplates;
