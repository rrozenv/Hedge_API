"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hedgeFundPositionSchema = new mongoose_1.default.Schema({
    hedgeFund: {
        type: new mongoose_1.default.Schema({
            name: {
                type: String,
                required: true
            },
            manager: {
                type: String,
                required: true
            }
        }),
        required: true
    },
    stockSymbol: {
        type: String,
        required: true
    },
    marketValue: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        required: true
    }
});
exports.hedgeFundPositionSchema = hedgeFundPositionSchema;
const HedgeFundPositionModel = mongoose_1.default.model('HedgeFundPosition', hedgeFundPositionSchema);
exports.HedgeFundPositionModel = HedgeFundPositionModel;
