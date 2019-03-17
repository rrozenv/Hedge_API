import AppController from './controllers/AppController';
import UsersController from './controllers/UsersController';
import StocksController from './controllers/StocksController';

const appController = new AppController(
  [
    new UsersController(),
    new StocksController()
  ],
);
 
appController.listen();