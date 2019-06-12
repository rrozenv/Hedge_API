require('./util/environment')();
import AppController from './controllers/AppController';
import UsersController from './controllers/UsersController';
import StocksController from './controllers/StocksController';
import PortfoliosController from './controllers/PortfoliosController';
import WatchlistController from './controllers/WatchlistController';
import PositionsController from './controllers/PositionsController';
import HedgeFundsController from './controllers/HedgeFundsController';
import { PortfolioPerformanceController } from './controllers/PortfolioPerformanceController';

new AppController(
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
 
// appController.listen();