"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const benchmarkPerformanceModelSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    performance: {
        type: Number,
        required: true
    }
});
const BenchmarkPerformanceModel = mongoose_1.default.model('BenchmarkPerformance', benchmarkPerformanceModelSchema);
exports.BenchmarkPerformanceModel = BenchmarkPerformanceModel;
