require('./environment')();
import AppController from './controllers/AppController';
import UsersController from './controllers/UsersController';
import StocksController from './controllers/StocksController';
import PortfoliosController from './controllers/PortfoliosController';
import WatchlistController from './controllers/WatchlistController';

const appController = new AppController(
  [
    new UsersController(),
    new StocksController(),
    new PortfoliosController(),
    new WatchlistController(),
  ],
);
 
appController.listen();