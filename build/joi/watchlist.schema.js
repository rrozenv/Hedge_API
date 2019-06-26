"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const position_schema_1 = require("./position.schema");
exports.default = joi_1.default.object().keys({
    name: joi_1.default.string().min(1).required(),
    positions: joi_1.default.array().items(position_schema_1.basicPositionSchema)
});
