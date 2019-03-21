// Dependencies
require('express-async-errors');
import express from 'express';
import mongoose from 'mongoose';
import config from 'config';
import debug from 'debug';
// Middleware
import error from '../middleware/error'
// Interfaces 
import Controller from '../interfaces/controller.interface'
// Models
import { PortfolioModel } from '../models/portfolio.model';
import { StockModel } from '../models/stock.model';
import { UserModel } from '../models/user.model';
import { QuoteModel } from '../models/quote.model';
// Model Templates
import stockTemplates from '../templates/stock.templates';
import portfolioTemplates from '../templates/portfolio.templates';
import { WatchlistModel } from '../models/watchlist.model';

// MARK: - AppController
class AppController {
    
    // MARK: - Properties
    public app: any;
    public server: any;
    private log: debug.Debugger;
    private env: string;
   
    // MARK: - Constructer
    constructor(controllers: Controller[])  {
      this.app = express();
      this.log = debug('controller:app');
      this.env = this.app.get('env');
      this.connectToTheDatabase();
      this.initializeExpressMiddleware();
      this.initializeControllers(controllers);
      this.initializeErrorMiddleware();
      this.logEnvironment();
      this.listen();

      this.clearDatabase();
      // this.seedDatabase();
    }
   
     // MARK: - Start server
    private listen() {
      const port = process.env.PORT || 3000;
      this.server = this.app.listen(port, () => this.log(`Listening on port ${port}...`));
    }
   
    // MARK: - Initalize express middleware
    private initializeExpressMiddleware() {
      this.app.use(express.json({}));
    }

    // MARK: - Initalize express middleware
    private initializeErrorMiddleware() {
      this.app.use(error);
    }
   
    // MARK: - Initalize controllers
    private initializeControllers(controllers: Controller[]) {
      controllers.forEach((controller) => {
        this.app.use('/api', controller.router);
      });
    }
   
    // MARK: - Connect to data base
    private connectToTheDatabase() {
      const db: string = config.get('db-host');
      mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false })
        .then(() => this.log(`Connected to ${db}...`))
        .catch(err => this.log(`Could not connect to ${db}...`));
    }

    // MARK: - Logs current environment
    private logEnvironment() { 
        switch (this.env) {
          case 'development':
            this.log('Running Dev Env...')
            break;
          case 'staging':
            this.log('Running Staging Env...')
            break;
          case 'production':
            this.log('Running Production Env...')
            break;
          case 'test':
            this.log('Running Test Env...')
            break;
          default: 
            this.log('NODE_ENV not set!')
            break;
        };
    }

    // MARK: - Clears data base if not in production 
    private async clearDatabase() { 
      if (this.env !== 'production') { 
        await PortfolioModel.collection.deleteMany({});
        await StockModel.collection.deleteMany({});
        // await UserModel.collection.deleteMany({});
        await QuoteModel.collection.deleteMany({});
        await WatchlistModel.collection.deleteMany({});
      }
    }

    // MARK: - Seeds data base with default models
    private async seedDatabase() { 
      await StockModel.collection.insertMany(stockTemplates);
      await PortfolioModel.collection.insertMany(portfolioTemplates);
    }

  }

  export default AppController;