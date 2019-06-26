"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import { positionSchema } from './position.model';
const watchlistSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    positions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Position'
        }]
}, {
    timestamps: true
});
const WatchlistModel = mongoose_1.default.model('Watchlist', watchlistSchema);
exports.WatchlistModel = WatchlistModel;
