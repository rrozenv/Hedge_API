"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const debug_1 = __importDefault(require("debug"));
// Middleware
const error_1 = __importDefault(require("../middleware/error"));
const prod_1 = __importDefault(require("../util/prod"));
// Models
const portfolio_model_1 = require("../models/portfolio.model");
const dailyPortfolioPerformance_model_1 = require("../models/dailyPortfolioPerformance.model");
const stock_model_1 = require("../models/stock.model");
const quote_model_1 = require("../models/quote.model");
const hedgeFund_model_1 = require("../models/hedgeFund.model");
const benchmarkPerformance_model_1 = require("../models/benchmarkPerformance.model");
const watchlist_model_1 = require("../models/watchlist.model");
const hedgeFund_templates_1 = __importDefault(require("../templates/hedgeFund.templates"));
const hedgeFundPosition_model_1 = require("../models/hedgeFundPosition.model");
const hedgeFundPosition_templates_1 = __importDefault(require("../templates/hedgeFundPosition.templates"));
// MARK: - AppController
class AppController {
    // MARK: - Constructer
    constructor(mongoose, controllers) {
        this.mongoose = mongoose;
        this.app = express_1.default();
        this.log = debug_1.default('controller:app');
        this.env = this.app.get('env');
        this.connectToTheDatabase();
        this.initializeExpressMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorMiddleware();
        this.logEnvironment();
        this.listen();
    }
    // MARK: - Start server
    listen() {
        const port = process.env.PORT || 3000;
        this.server = this.app.listen(port, () => this.log(`Listening on port ${port}...`));
    }
    // MARK: - Initalize express middleware
    initializeExpressMiddleware() {
        this.app.use(express_1.default.json({}));
    }
    // MARK: - Initalize express middleware
    initializeErrorMiddleware() {
        this.app.use(error_1.default);
    }
    // MARK: - Initalize controllers
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
    }
    // MARK: - Connect to data base
    connectToTheDatabase() {
        const db = config_1.default.get('db-host');
        this.mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false })
            .then(async () => {
            this.log(`Connected to ${db}...`);
            // await this.clearDatabase();
            // await this.seedDatabase();
        })
            .catch((err) => this.log(`Could not connect to ${db}...: ${err}`));
    }
    // MARK: - Logs current environment
    logEnvironment() {
        switch (this.env) {
            case 'development':
                this.log('Running Dev Env...');
                break;
            case 'staging':
                this.log('Running Staging Env...');
                break;
            case 'production':
                prod_1.default(this.app);
                this.log('Running Production Env...');
                break;
            case 'test':
                this.log('Running Test Env...');
                break;
            default:
                this.log('NODE_ENV not set!');
                break;
        }
        ;
    }
    // MARK: - Clears data base if not in production 
    async clearDatabase() {
        this.log('Clearing database...');
        if (this.env !== 'production') {
            // await UserModel.collection.deleteMany({});
            await portfolio_model_1.PortfolioModel.collection.deleteMany({});
            await stock_model_1.StockModel.collection.deleteMany({});
            await quote_model_1.QuoteModel.collection.deleteMany({});
            await watchlist_model_1.WatchlistModel.collection.deleteMany({});
            await dailyPortfolioPerformance_model_1.DailyPortfolioPerformanceModel.collection.deleteMany({});
            await benchmarkPerformance_model_1.BenchmarkPerformanceModel.collection.deleteMany({});
        }
    }
    // MARK: - Seeds data base with default models
    async seedDatabase() {
        this.log('Seeding database...');
        // Stocks
        // await StockModel.collection.insertMany(stockTemplates);
        // Hedge Funds 
        await hedgeFund_model_1.HedgeFundModel.collection.insertMany(hedgeFund_templates_1.default);
        // Hedge Fund Positions 
        await hedgeFundPosition_model_1.HedgeFundPositionModel.collection.insertMany(hedgeFundPosition_templates_1.default);
        // Portfolios
        // const portfolios = portfolioTemplates;
        // await PortfolioModel.collection.insertMany(portfolios);
        // Positions
        // await PositionModel.collection.insertMany(positionTemplates);
        // // Daily Portfolio Returns
        // portfolios.map(async (port) => { 
        //   let templates = dailyPortfolioPerformanceTemplates(port);
        //   await DailyPortfolioPerformanceModel.collection.insertMany(templates);
        // });
    }
}
exports.default = AppController;
