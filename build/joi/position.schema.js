"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const stock_schema_1 = require("./stock.schema");
// Basic - Used when creating watchlist
const basicPositionSchema = joi_1.default.object().keys({
    stock: stock_schema_1.stockWithQuoteSchema.required(),
    buyPricePerShare: joi_1.default.number().positive().required(),
    shares: joi_1.default.number().positive().integer().required(),
});
exports.basicPositionSchema = basicPositionSchema;
// Create - Used when adding a position to watchlists
const createPositionSchema = basicPositionSchema
    .concat(joi_1.default.object().keys({
    watchlistIds: joi_1.default.array().items(joi_1.default.string()).required()
}));
exports.createPositionSchema = createPositionSchema;
// Update - Used when updating position 
const updatePositionSchema = joi_1.default.object().keys({
    buyPricePerShare: joi_1.default.number().positive().required(),
    shares: joi_1.default.number().positive().integer().required(),
});
exports.updatePositionSchema = updatePositionSchema;
