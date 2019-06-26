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
const joi_1 = __importDefault(require("../middleware/joi"));
// Models
const hedgeFund_model_1 = require("../models/hedgeFund.model");
const hedgeFundPosition_model_1 = require("../models/hedgeFundPosition.model");
// Utils
const Path_1 = __importDefault(require("../util/Path"));
const Error_1 = __importDefault(require("../util/Error"));
// MARK: - PortfoliosController
class HedgeFundsController {
    // MARK: - Constructor
    constructor() {
        // MARK: - Properties
        this.router = express_1.default.Router({});
        /// ** ---- GET ROUTES ---- **
        // MARK: - Get hedge funds
        this.getHedgeFunds = async (req, res) => {
            // Find Hedge Funds
            const hedgeFunds = await hedgeFund_model_1.HedgeFundModel.find();
            // Send response 
            res.send({ hedgeFunds: hedgeFunds });
        };
        // MARK: - Get all positions for hedge fund. 
        this.getHedgeFundPositions = async (req, res) => {
            // Find Hedge Fund Positions for `id`
            const hedgeFundPositions = await hedgeFundPosition_model_1.HedgeFundPositionModel.find({
                'hedgeFund._id': req.params.id
            });
            // Send response 
            res.send({ positions: hedgeFundPositions });
        };
        /// ** ---- POST ROUTES ---- **
        // MARK: - Create hedge fund
        this.createHedgeFund = async (req, res) => {
            // Create fund
            const hedgeFundModel = new hedgeFund_model_1.HedgeFundModel({
                name: req.body.name,
                manager: req.body.manager
            });
            await hedgeFundModel.save();
            // Send response 
            res.send(hedgeFundModel);
        };
        // MARK: - Add positions to hedge fund
        this.addHedgeFundPositions = async (req, res) => {
            // Find hedge fund by id 
            const hedgeFund = await hedgeFund_model_1.HedgeFundModel.findById(req.params.id);
            if (!hedgeFund)
                return res.status(400).send(new Error_1.default('Bad Request', `Hedge fund not found for: ${req.params.id}`));
            // Convert positions to models. 
            const positions = req.body.positions;
            const positionModels = await Promise.all(positions.map(async (pos) => {
                const model = new hedgeFundPosition_model_1.HedgeFundPositionModel({
                    hedgeFund: hedgeFund,
                    stockSymbol: pos.symbol,
                    marketValue: pos.marketValue,
                    purchaseDate: pos.purchaseDate
                });
                await model.save();
                return model;
            }));
            // Send response.
            res.send(positionModels);
        };
        this.log = debug_1.default('controller:hedgeFunds');
        this.initializeRoutes();
    }
    initializeRoutes() {
        // GET 
        this.router.get(Path_1.default.hedgeFunds, [auth_1.default], this.getHedgeFunds);
        this.router.get(`${Path_1.default.hedgeFunds}/:id/positions`, [auth_1.default, validateObjectId_1.default], this.getHedgeFundPositions);
        // POST
        this.router.post(Path_1.default.hedgeFunds, [auth_1.default, joi_1.default], this.createHedgeFund);
        this.router.post(`${Path_1.default.hedgeFunds}/:id/positions`, [auth_1.default, joi_1.default, validateObjectId_1.default], this.addHedgeFundPositions);
    }
}
exports.default = HedgeFundsController;
