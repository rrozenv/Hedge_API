require('./environment')();
import AppController from './controllers/AppController';
import UsersController from './controllers/UsersController';
import StocksController from './controllers/StocksController';
import PortfoliosController from './controllers/PortfoliosController';
import WatchlistController from './controllers/WatchlistController';
import PositionsController from './controllers/PositionsController';

new AppController(
  [
    new UsersController(),
    new StocksController(),
    new PortfoliosController(),
    new WatchlistController(),
    new PositionsController()
  ],
);
 
// appController.listen();