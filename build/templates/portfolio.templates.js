"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const portfolio_model_1 = require("../models/portfolio.model");
const position_templates_1 = __importDefault(require("./position.templates"));
const portfolioTemplates = [
    new portfolio_model_1.PortfolioModel({
        name: "First Portfolio",
        description: "First Desc",
        rebalanceDate: new Date(),
        positions: position_templates_1.default,
    }),
    new portfolio_model_1.PortfolioModel({
        name: "Second Portfolio",
        description: "Second Desc",
        rebalanceDate: new Date(),
        positions: position_templates_1.default,
    }),
    new portfolio_model_1.PortfolioModel({
        name: "Second Portfolio",
        description: "Second Desc",
        rebalanceDate: new Date(),
        positions: position_templates_1.default,
    })
];
exports.default = portfolioTemplates;
