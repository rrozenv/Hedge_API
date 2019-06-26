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
class PositionsController {
    // MARK: - Constructor
    constructor() {
        // MARK: - Properties
        this.router = express_1.default.Router({});
        // MARK: - Get portfolio by id
        this.getPosition = async (req, res) => {
            const position = await position_model_1.PositionModel.findById(req.params.id);
            if (!position)
                return res.status(400).send(`Position not found for: ${req.params.id}`);
            res.send(position);
        };
        /// ** ---- POST ROUTES ---- **
        // MARK: - Create watchlist
        this.createPosition = async (req, res) => {
            // Find watchlists for given id's
            const watchlistIds = req.body.watchlistIds;
            const watchlists = await watchlist_model_1.WatchlistModel
                .find({ _id: { $in: watchlistIds } });
            // Create a new position in every watchlist
            const newPositions = await Promise.all(watchlists.map(async (w) => {
                const position = new position_model_1.PositionModel({
                    stock: req.body.stock,
                    buyPricePerShare: req.body.buyPricePerShare,
                    shares: req.body.shares
                });
                await position.save();
                w.positions.push(position._id);
                await w.save();
                return position;
            }));
            // Return positions 
            res.send(newPositions);
        };
        /// ** ---- PUT ROUTES ---- **
        // MARK: - Update position
        this.updatePosition = async (req, res) => {
            const position = await position_model_1.PositionModel.findByIdAndUpdate(req.params.id, {
                buyPricePerShare: req.body.buyPricePerShare,
                shares: req.body.shares
            }, { new: true });
            if (!position)
                return res.status(400).send(`Position not found for: ${req.params.id}`);
            res.send(position);
        };
        this.iex_service = new IEXService_1.default();
        this.log = debug_1.default('controller:positions');
        this.initializeRoutes();
    }
    // MARK: - Create Routes
    initializeRoutes() {
        this.router.get(`${Path_1.default.positions}/:id`, this.getPosition);
        this.router.post(Path_1.default.createPositions, [auth_1.default, joi_1.default], this.createPosition);
        this.router.put(Path_1.default.updatePositions, [auth_1.default, joi_1.default], this.updatePosition);
    }
}
exports.default = PositionsController;
