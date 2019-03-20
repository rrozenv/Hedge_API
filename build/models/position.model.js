"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var positionSchema = new mongoose_1.default.Schema({
    stock: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Stock'
    },
    buyPricePerShare: {
        type: Number,
        required: true
    },
    shares: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});
var PositionModel = mongoose_1.default.model('Position', positionSchema);
exports.PositionModel = PositionModel;
