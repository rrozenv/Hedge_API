"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const position_model_1 = require("../models/position.model");
const stock_templates_1 = __importDefault(require("./stock.templates"));
const investmentSummaryGroup_templates_1 = __importDefault(require("./investmentSummaryGroup.templates"));
const hedgeFundPosition_templates_1 = __importDefault(require("./hedgeFundPosition.templates"));
const positionTemplates = [
    new position_model_1.PositionModel({
        stock: stock_templates_1.default[0],
        buyPricePerShare: 100.0,
        shares: 1,
        type: 'buy',
        status: 'new',
        weightPercentage: 0.5,
        investmentSummaryGroups: investmentSummaryGroup_templates_1.default,
        hedgeFundPositions: hedgeFundPosition_templates_1.default
    }),
    new position_model_1.PositionModel({
        stock: stock_templates_1.default[1],
        buyPricePerShare: 100.0,
        shares: 1,
        type: 'buy',
        status: 'new',
        weightPercentage: 0.5,
        investmentSummaryGroups: investmentSummaryGroup_templates_1.default,
        hedgeFundPositions: hedgeFundPosition_templates_1.default
    }),
    new position_model_1.PositionModel({
        stock: stock_templates_1.default[2],
        buyPricePerShare: 100.0,
        shares: 1,
        type: 'buy',
        status: 'new',
        weightPercentage: 0.5,
        investmentSummaryGroups: investmentSummaryGroup_templates_1.default,
        hedgeFundPositions: hedgeFundPosition_templates_1.default
    })
];
exports.default = positionTemplates;
