"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = __importDefault(require("express"));
// Middleware
const auth_1 = __importDefault(require("../middleware/auth"));
const validateObjectId_1 = __importDefault(require("../middleware/validateObjectId"));
// Models
const stock_model_1 = require("../models/stock.model");
// Services
const IEXService_1 = __importDefault(require("../services/IEXService"));
const Error_1 = __importDefault(require("../util/Error"));
// Path
const Path_1 = __importDefault(require("../util/Path"));
// MARK: - StocksController
class StocksController {
    // MARK: - Constructor
    constructor() {
        // MARK: - Properties
        this.path = '/stocks';
        this.router = express_1.default.Router({});
        /// ** ---- GET ROUTES ---- **
        this.getStockQuote = async (req, res) => {
            try {
                const quote = await this.iex_service.fetchQuote(req.params.ticker);
                res.send(quote);
            }
            catch (error) {
                res.status(400).send(new Error_1.default('Bad Request', `Request failed for stock: ${req.params.ticker}`));
            }
        };
        this.getStockChart = async (req, res) => {
            try {
                const chartData = await this.iex_service.fetchChart(req.params.ticker, req.params.range);
                const filteredChartData = chartData.filter(item => item.close != undefined);
                const chartPoints = filteredChartData.map((item) => {
                    return {
                        xValue: item.date,
                        yValue: item.close
                    };
                });
                const firstChartPoint = filteredChartData[0];
                const lastChartPoint = filteredChartData[filteredChartData.length - 1];
                const percentageReturn = (lastChartPoint.close - firstChartPoint.open) / firstChartPoint.open;
                res.send({
                    startDate: firstChartPoint.date,
                    endDate: lastChartPoint.date,
                    range: req.params.range,
                    percentageReturn: percentageReturn,
                    dollarValue: lastChartPoint.close,
                    chart: { points: chartPoints }
                });
            }
            catch (error) {
                res.status(400).send(new Error_1.default('Bad Request', `Request failed for stock: ${req.params.ticker}`));
            }
        };
        // MARK: - Get portfolio by id
        this.getPrimaryStockData = async (req, res) => {
            // Find portfolios
            const stock = await stock_model_1.StockModel.findById(req.params.id);
            if (!stock)
                return res.status(400).send(new Error_1.default('Bad Request', `Stock not found for: ${req.params.id}`));
            const quote = await this.iex_service.fetchQuotes([stock.symbol], ['quote']);
            stock.quote = quote[0];
            // Send response 
            res.send(stock);
        };
        // MARK: - Get portfolio by id
        this.getStockInvestmentSummary = async (req, res) => {
            // Find portfolios
            const stock = await stock_model_1.StockModel.findById(req.params.id);
            if (!stock)
                return res.status(400).send(new Error_1.default('Bad Request', `Stock not found for: ${req.params.id}`));
            const quote = await this.iex_service.fetchQuotes([stock.symbol], ['quote']);
            stock.quote = quote[0];
            // Send response 
            res.send(stock);
        };
        this.iex_service = new IEXService_1.default();
        this.initializeRoutes();
    }
    // MARK: - Create routes
    initializeRoutes() {
        this.router.get(`${Path_1.default.stocks}/:ticker`, [auth_1.default], this.getStockQuote);
        this.router.get(`${Path_1.default.stocks}/:ticker/performance/:range`, [auth_1.default], this.getStockChart);
        this.router.get(`${Path_1.default.stocks}/:id`, [auth_1.default, validateObjectId_1.default], this.getPrimaryStockData);
    }
}
exports.default = StocksController;
