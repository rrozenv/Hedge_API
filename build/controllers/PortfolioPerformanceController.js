"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = __importDefault(require("express"));
const debug_1 = __importDefault(require("debug"));
const moment_1 = __importDefault(require("moment"));
// Middleware
const auth_1 = __importDefault(require("../middleware/auth"));
const validateObjectId_1 = __importDefault(require("../middleware/validateObjectId"));
// Models
const portfolio_model_1 = require("../models/portfolio.model");
const dailyPortfolioPerformance_model_1 = require("../models/dailyPortfolioPerformance.model");
const benchmarkPerformance_model_1 = require("../models/benchmarkPerformance.model");
// Services
const IEXService_1 = __importDefault(require("../services/IEXService"));
const Error_1 = __importDefault(require("../util/Error"));
// Path
const Path_1 = __importDefault(require("../util/Path"));
;
// MARK: - PortfoliosController
class PortfolioPerformanceController {
    // MARK: - Constructor
    constructor() {
        // MARK: - Properties
        this.router = express_1.default.Router({});
        /// ** ---- GET ROUTES ---- **
        // MARK: - Get performance for range
        this.getPerformance = async (req, res) => {
            // Find portfolio
            const portfolio = await portfolio_model_1.PortfolioModel.findById(req.params.id);
            if (!portfolio)
                return res.status(400).send(new Error_1.default('Bad Request', `Portfolio not found for: ${req.params.id}`));
            // Create performance response 
            const range = req.query.range;
            const performanceResponse = await createChartPerformanceResponse(portfolio, range);
            // Send response
            res.send(performanceResponse);
        };
        /// ** ---- POST ROUTES ---- **
        // MARK: - Get performance for range
        this.createPerformance = async (req, res) => {
            // Find portfolio by id.
            const portfolio = await portfolio_model_1.PortfolioModel.findById(req.params.id);
            if (!portfolio)
                return res.status(400).send(new Error_1.default('Bad Request', `Portfolio not found for: ${req.params.id}`));
            // Create performance points.
            const chartPoints = req.body.chartPoints;
            const performanceModels = await Promise.all(chartPoints.map(async (point) => {
                const model = new dailyPortfolioPerformance_model_1.DailyPortfolioPerformanceModel({
                    portfolio: portfolio._id,
                    date: point.date,
                    performance: point.performance
                });
                await model.save();
                return model;
            }));
            // Send response. 
            res.send(performanceModels);
        };
        // MARK: - Create benchmark performance for type. 
        this.createBenchmarkPerformance = async (req, res) => {
            // Create benchmark chart points.
            const chartPoints = req.body.chartPoints;
            const performanceModels = await Promise.all(chartPoints.map(async (point) => {
                const model = new benchmarkPerformance_model_1.BenchmarkPerformanceModel({
                    type: req.params.type,
                    date: point.date,
                    performance: point.performance
                });
                await model.save();
                return model;
            }));
            // Send response. 
            res.send(performanceModels);
        };
        this.iex_service = new IEXService_1.default();
        this.log = debug_1.default('controller:portfolioPerformance');
        this.initializeRoutes();
    }
    initializeRoutes() {
        // GET 
        this.router.get(`${Path_1.default.portfolios}/:id/chart`, [auth_1.default, validateObjectId_1.default], this.getPerformance);
        // POST
        this.router.post(`${Path_1.default.portfolios}/:id/chart`, [auth_1.default, validateObjectId_1.default], this.createPerformance);
        this.router.post(`${Path_1.default.benchmarks}/:type/chart`, [auth_1.default, validateObjectId_1.default], this.createBenchmarkPerformance);
    }
}
exports.PortfolioPerformanceController = PortfolioPerformanceController;
const createChartPerformanceResponse = async (portfolio, range) => {
    const startDate = findStartDate(range);
    const endDate = moment_1.default().toDate();
    const query = {
        portfolio: portfolio,
        date: Object.assign({ $lte: endDate }, startDate && { $gte: startDate })
    };
    const chartPointModels = await dailyPortfolioPerformance_model_1.DailyPortfolioPerformanceModel
        .find(query)
        .sort('date');
    const chartPoints = createChartPoints(chartPointModels);
    const percentageReturn = calculatePercentageReturn(chartPointModels);
    const benchmarkPerformance = await createBenchmarkPerformanceResponse(portfolio.benchmarkType, endDate, startDate);
    return {
        startDate: moment_1.default(chartPointModels[0].date).startOf('month').toDate(),
        endDate: chartPointModels[chartPointModels.length - 1].date,
        range: range,
        percentageReturn: percentageReturn,
        chart: { points: chartPoints },
        benchmark: benchmarkPerformance
    };
};
exports.createChartPerformanceResponse = createChartPerformanceResponse;
const findStartDate = (range) => {
    switch (range) {
        case 'month':
            return moment_1.default().subtract(2, 'months').endOf('month').toDate();
        case 'threeMonths':
            return moment_1.default().subtract(4, 'months').endOf('month').toDate();
        case 'sixMonths':
            return moment_1.default().subtract(7, 'months').endOf('month').toDate();
        case 'year':
            return moment_1.default().subtract(13, 'months').endOf('month').toDate();
        default:
            return undefined;
    }
};
const createBenchmarkPerformanceResponse = async (type, endDate, startDate) => {
    const query = {
        type: type,
        date: Object.assign({ $lte: endDate }, startDate && { $gte: startDate })
    };
    const benchmarkModels = await benchmarkPerformance_model_1.BenchmarkPerformanceModel
        .find(query)
        .sort('date');
    const percentageReturn = calculatePercentageReturn(benchmarkModels);
    const chartPoints = createChartPoints(benchmarkModels);
    return {
        type: type,
        percentageReturn: percentageReturn,
        chart: { points: chartPoints }
    };
};
const createChartPoints = (returnValues) => {
    let sum = 1000;
    return returnValues.map((val) => {
        sum = sum * (1 + val.performance);
        return {
            xValue: val.date.toJSON(),
            yValue: sum - 1000
        };
    });
};
const calculatePercentageReturn = (returnValues) => {
    const endingValue = returnValues.reduce((sum, val) => {
        return sum * (1 + val.performance);
    }, 1);
    return endingValue - 1;
};
