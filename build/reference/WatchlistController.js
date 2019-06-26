"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependecies
const express_1 = __importDefault(require("express"));
const debug_1 = __importDefault(require("debug"));
// Middleware
const auth_1 = __importDefault(require("../middleware/auth"));
const joi_1 = __importDefault(require("../middleware/joi"));
// Models
const watchlist_model_1 = require("../models/watchlist.model");
const position_model_1 = require("../models/position.model");
// Services
const IEXService_1 = __importDefault(require("../services/IEXService"));
// Path
const Path_1 = __importDefault(require("../util/Path"));
// MARK: - WatchlistsController
class WatchlistsController {
    // MARK: - Constructor
    constructor() {
        // MARK: - Properties
        this.router = express_1.default.Router({});
        /// ** ---- GET ROUTES ---- **
        // MARK: - Get all users watchlists
        this.getWatchlists = async (req, res) => {
            const watchlists = await watchlist_model_1.WatchlistModel
                .find({ user: req.user })
                .populate('positions');
            res.send(watchlists);
        };
        /// ** ---- POST ROUTES ---- **
        // MARK: - Create watchlist
        this.createWatchlist = async (req, res) => {
            const name = req.body.name;
            const positions = req.body.positions;
            // Create and save position models
            const positionModels = positions.map((p) => {
                return new position_model_1.PositionModel({
                    stock: p.stock,
                    buyPricePerShare: p.buyPricePerShare,
                    shares: p.shares,
                });
            });
            const savedPositions = await position_model_1.PositionModel.collection.insertMany(positionModels);
            // Create watchlist with positions
            const watchlist = new watchlist_model_1.WatchlistModel({
                name: name,
                user: req.user,
                positions: savedPositions.ops
            });
            await watchlist.save();
            // Return watchlist 
            res.send(Object.assign({}, watchlist.toObject(), { positions: savedPositions.ops }));
        };
        this.iex_service = new IEXService_1.default();
        this.log = debug_1.default('controller:watchlists');
        this.initializeRoutes();
    }
    // MARK: - Create Routes
    initializeRoutes() {
        this.router.get(Path_1.default.watchlists, auth_1.default, this.getWatchlists);
        this.router.post(Path_1.default.watchlists, [auth_1.default, joi_1.default], this.createWatchlist);
    }
}
exports.default = WatchlistsController;
