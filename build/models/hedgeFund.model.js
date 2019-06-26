"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hedgeFundSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    manager: {
        type: String,
        required: true
    }
});
exports.hedgeFundSchema = hedgeFundSchema;
const HedgeFundModel = mongoose_1.default.model('HedgeFund', hedgeFundSchema);
exports.HedgeFundModel = HedgeFundModel;
