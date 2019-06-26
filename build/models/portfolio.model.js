"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const portfolioSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 10000
    },
    rebalanceDate: {
        type: Date,
        required: true
    },
    benchmarkType: {
        type: String,
        required: true
    },
    positions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Position'
        }]
}, {
    timestamps: true
});
const PortfolioModel = mongoose_1.default.model('Portfolio', portfolioSchema);
exports.PortfolioModel = PortfolioModel;
