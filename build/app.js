"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// require('./util/environment')();
const mongoose = require('mongoose');
mongoose.plugin(require('@meanie/mongoose-to-json'));
const AppController_1 = __importDefault(require("./controllers/AppController"));
const UsersController_1 = __importDefault(require("./controllers/UsersController"));
const StocksController_1 = __importDefault(require("./controllers/StocksController"));
const PortfoliosController_1 = __importDefault(require("./controllers/PortfoliosController"));
const PortfolioPositionsController_1 = require("./controllers/PortfolioPositionsController");
const HedgeFundsController_1 = __importDefault(require("./controllers/HedgeFundsController"));
const PortfolioPerformanceController_1 = require("./controllers/PortfolioPerformanceController");
new AppController_1.default(mongoose, [
    new UsersController_1.default(),
    new StocksController_1.default(),
    new PortfoliosController_1.default(),
    new PortfolioPositionsController_1.PortfolioPositionsController(),
    new PortfolioPerformanceController_1.PortfolioPerformanceController(),
    new HedgeFundsController_1.default()
]);
