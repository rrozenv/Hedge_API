require('./util/environment')();
const mongoose = require('mongoose');
mongoose.plugin(require('@meanie/mongoose-to-json'));
import AppController from './controllers/AppController';
import UsersController from './controllers/UsersController';
import StocksController from './controllers/StocksController';
import PortfoliosController from './controllers/PortfoliosController';
import WatchlistController from './controllers/WatchlistController';
import PositionsController from './controllers/PositionsController';
import HedgeFundsController from './controllers/HedgeFundsController';
import { PortfolioPerformanceController } from './controllers/PortfolioPerformanceController';

new AppController(
  mongoose,
  [
    new UsersController(),
    new StocksController(),
    new PortfoliosController(),
    new WatchlistController(),
    new PositionsController(),
    new PortfolioPerformanceController(),
    new HedgeFundsController()
  ],
);
