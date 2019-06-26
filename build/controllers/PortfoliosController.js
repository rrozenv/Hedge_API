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
// Models
const portfolio_model_1 = require("../models/portfolio.model");
// Services
const IEXService_1 = __importDefault(require("../services/IEXService"));
const PortfolioPerformanceController_1 = require("./PortfolioPerformanceController");
const PortfolioPositionsController_1 = require("./PortfolioPositionsController");
// Path
const Path_1 = __importDefault(require("../util/Path"));
// MARK: - PortfoliosController
class PortfoliosController {
    // MARK: - Constructor
    constructor() {
        // MARK: - Properties
        this.router = express_1.default.Router({});
        /// ** ---- GET ROUTES ---- **
        // MARK: - Get dashboard
        this.getDashboardPortfolios = async (req, res) => {
            // Find portfolios
            const portfolios = await portfolio_model_1.PortfolioModel.find();
            // Create response 
            const modifiedPortfolios = await Promise.all(portfolios.map(async (port) => {
                const performance = await PortfolioPerformanceController_1.createChartPerformanceResponse(port, req.query.range);
                return {
                    id: port._id,
                    name: port.name,
                    description: port.description,
                    rebalanceDate: port.rebalanceDate,
                    benchmarkType: port.benchmarkType,
                    performance: performance,
                    positions: port.positions
                };
            }));
            // Send response 
            res.send({ portfolios: modifiedPortfolios });
        };
        this.getPortfolioPositions = async (req, res) => {
            // Find portfolio posiitons. 
            const positions = await portfolio_model_1.PortfolioModel
                .findById(req.params.id)
                .populate('positions');
            // Send response.
            res.send(positions);
        };
        this.getPortfolioPerformance = async (req, res) => {
            // Find portfolio by id. 
            const portfolio = await portfolio_model_1.PortfolioModel.findById(req.params.id);
            if (!portfolio)
                return res.status(400).send(`Portfolio not found for: ${req.params.id}`);
            // Create chart perfromance.
            const performance = await PortfolioPerformanceController_1.createChartPerformanceResponse(portfolio, req.params.range);
            // Send response.
            res.send(performance);
        };
        this.createPortfolio = async (req, res) => {
            const name = req.body.name;
            const description = req.body.description;
            const rebalanceDate = req.body.rebalanceDate;
            const benchmarkType = req.body.benchmarkType;
            const positions = req.body.positions;
            const positionModels = await Promise.all(positions.map(async (pos) => {
                return await PortfolioPositionsController_1.createPosition(pos);
            }));
            const portfolio = new portfolio_model_1.PortfolioModel({
                name: name,
                description: description,
                rebalanceDate: rebalanceDate,
                benchmarkType: benchmarkType,
                positions: positionModels
            });
            await portfolio.save();
            res.send(portfolio);
        };
        this.iex_service = new IEXService_1.default();
        this.log = debug_1.default('controller:portfolios');
        this.initializeRoutes();
    }
    initializeRoutes() {
        // GET
        this.router.get(Path_1.default.dashboard, [auth_1.default], this.getDashboardPortfolios);
        this.router.get(`${Path_1.default.portfolios}/:id/positions`, [auth_1.default, validateObjectId_1.default], this.getPortfolioPositions);
        this.router.get(`${Path_1.default.portfolios}/:id/performance/:range`, [auth_1.default, validateObjectId_1.default], this.getPortfolioPerformance);
        // POST
        this.router.post(Path_1.default.portfolios, this.createPortfolio);
    }
}
exports.default = PortfoliosController;
// MARK: - Get portfolio by id
// private getPortfolio = async (req: any, res: any) => { 
//     // Find portfolio by id
//     let portfolio = await PortfolioModel.findById(req.params.id); 
//     if (!portfolio) return res.status(400).send(`Portfolio not found for: ${req.params.id}`)
//     // Try to fetch updated stock quotes and return updated portfolio
//     // If call to IEX fails log error and return portfolio 
//     try { 
//         const updatedStocks = await this.iex_service.fetchQuotesForStocks(portfolio.stocks);
//         portfolio.stocks = updatedStocks;
//         await portfolio.save();
//         res.send(portfolio);
//     } catch(error) { 
//         this.log(error);
//         res.send(portfolio);
//     }
// };
// MARK: - Get Old Dashboard
// private getPortfolios = async (req: any, res: any) => {
//     // Find portfolios
//     const portfolios = await PortfolioModel.find()
//     // If first portfolio return empty array 
//     let firstPortfolio = portfolios.shift();
//     if (!firstPortfolio) return res.send(portfolios)
//     // Try to fetch updated stocks for first portoflio only
//     try { 
//         const updatedStocks = await this.iex_service.fetchQuotesForStocks(firstPortfolio.stocks);
//         firstPortfolio.stocks = updatedStocks;
//         await firstPortfolio.save();
//     } catch(error) { 
//         this.log(error);
//     }
//     // Return all portfolios with first having updated stock quotes
//     res.send({ portfolios: [firstPortfolio].concat(portfolios) });
// }
/// ** ---- POST ROUTES ---- **
// MARK: - POST API's
// private createPortfolio = async (req: any, res: any) => { 
//     // Create stocks
//     const name: string = req.body.name;
//     const description: string = req.body.description;
//     const stocks: IStock[] = req.body.stocks;
//     try { 
//         // Create stocks 
//         const newStocks = await Promise.all(
//             stocks.map(async (stock) => await this.createStock(stock))
//         );
//         // Create portfolio 
//         const portfolio = new PortfolioModel({ 
//             name: name,
//             description: description,
//             stocks: newStocks,
//         });
//         await portfolio.save();
//         // Return portfolio 
//         res.send(portfolio);
//     } catch (err) { 
//         // Return error if calling IEX for stock quotes fails
//         res.status(500).send(
//             new APIError(
//                 'Interal Server Error', 
//                 'Failed to fetch stock quotes for portfolio'
//             )
//         )
//     }
// }
