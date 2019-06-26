"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stock_model_1 = require("./stock.model");
const investmentSummaryGroup_model_1 = require("./investmentSummaryGroup.model");
const positionSchema = new mongoose_1.default.Schema({
    stock: {
        type: stock_model_1.stockSchema,
        required: true
    },
    buyPricePerShare: {
        type: Number,
        required: true
    },
    shares: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    weightPercentage: {
        type: Number,
        required: false
    },
    investmentSummaryGroups: [investmentSummaryGroup_model_1.investmentSummaryGroupSchema],
    hedgeFundPositions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'HedgeFundPosition'
        }]
}, {
    timestamps: true
});
exports.positionSchema = positionSchema;
const PositionModel = mongoose_1.default.model('Position', positionSchema);
exports.PositionModel = PositionModel;
