"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hedgeFundPosition_model_1 = require("../models/hedgeFundPosition.model");
const hedgeFund_templates_1 = __importDefault(require("./hedgeFund.templates"));
const hedgeFundPositionTemplates = [
    new hedgeFundPosition_model_1.HedgeFundPositionModel({
        hedgeFund: {
            _id: hedgeFund_templates_1.default[0]._id,
            name: hedgeFund_templates_1.default[0].name,
            manager: hedgeFund_templates_1.default[0].manager
        },
        stockSymbol: "AAPL",
        marketValue: 20000,
        purchaseDate: Date.now
    }),
    new hedgeFundPosition_model_1.HedgeFundPositionModel({
        hedgeFund: {
            _id: hedgeFund_templates_1.default[0]._id,
            name: hedgeFund_templates_1.default[0].name,
            manager: hedgeFund_templates_1.default[0].manager
        },
        stockSymbol: "FB",
        marketValue: 450606,
        purchaseDate: Date.now
    }),
    new hedgeFundPosition_model_1.HedgeFundPositionModel({
        hedgeFund: {
            _id: hedgeFund_templates_1.default[1]._id,
            name: hedgeFund_templates_1.default[1].name,
            manager: hedgeFund_templates_1.default[1].manager
        },
        stockSymbol: "TSLA",
        marketValue: 222939,
        purchaseDate: Date.now
    }),
];
exports.default = hedgeFundPositionTemplates;
