"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
exports.default = (function (req, res, next) {
    console.log('Validate ID HIt');
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID.');
    console.log('Object id is valid!');
    next();
});
