// require('./util/environment')();
const mongoose = require('mongoose');
mongoose.plugin(require('@meanie/mongoose-to-json'));
import AppController from './controllers/AppController';
import UsersController from './controllers/UsersController';
import StocksController from './controllers/StocksController';
import PortfoliosController from './controllers/PortfoliosController';
import WatchlistController from './reference/WatchlistController';
import PositionsController from './reference/PositionsController';
import { PortfolioPositionsController } from './controllers/PortfolioPositionsController';
import HedgeFundsController from './controllers/HedgeFundsController';
import { PortfolioPerformanceController } from './controllers/PortfolioPerformanceController';

new AppController(
  mongoose,
  [
    new UsersController(),
    new StocksController(),
    new PortfoliosController(),
    new PortfolioPositionsController(),
    new PortfolioPerformanceController(),
    new HedgeFundsController()
  ],
);
