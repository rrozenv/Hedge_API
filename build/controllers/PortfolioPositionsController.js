"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = __importDefault(require("express"));
const debug_1 = __importDefault(require("debug"));
// Middleware
const auth_1 = __importDefault(require("../middleware/auth"));
const validateObjectId_1 = __importDefault(require("../middleware/validateObjectId"));
const position_model_1 = require("../models/position.model");
// Path
const Path_1 = __importDefault(require("../util/Path"));
// MARK: - PortfoliosController
class PortfolioPositionsController {
    // MARK: - Constructor
    constructor() {
        // MARK: - Properties
        this.router = express_1.default.Router({});
        /// ** ---- GET ROUTES ---- **
        // MARK: - Get Positions for Hedge Fund
        this.getHedgeFundPositions = async (req, res) => {
            const portfolioPosition = await position_model_1.PositionModel
                .findById(req.params.id)
                .populate('hedgeFundPositions');
            // Send response 
            res.send({ positions: portfolioPosition.hedgeFundPositions });
        };
        this.log = debug_1.default('controller:portfolioPerformance');
        this.initializeRoutes();
    }
    initializeRoutes() {
        // GET
        this.router.get(`${Path_1.default.positions}/:id/hedgeFundPositions`, [auth_1.default, validateObjectId_1.default], this.getHedgeFundPositions);
    }
}
exports.PortfolioPositionsController = PortfolioPositionsController;
const createPosition = async (position) => {
    const model = new position_model_1.PositionModel({
        stock: position.stock,
        buyPricePerShare: position.buyPricePerShare,
        shares: position.shares,
        type: position.type,
        status: position.status,
        weightPercentage: position.weightPercentage ? position.weightPercentage : 0.0,
        investmentSummaryGroups: position.investmentSummaryGroups,
        hedgeFundPositions: position.hedgeFundPositions
    });
    await model.save();
    return model;
};
exports.createPosition = createPosition;
