import express from 'express';
import mongoose from 'mongoose';
import config from 'config';
import debug from 'debug';
import Controller from '../interfaces/controller.interface'
import error from '../middleware/error'
import { PortfolioModel } from '../models/portfolio.model';
import { StockModel } from '../models/stock.model';
import { UserModel } from '../models/user.model';
import { QuoteModel } from '../models/quote.model';
import stockTemplates from '../templates/stock.templates';
import portfolioTemplates from '../templates/portfolio.templates';
require('express-async-errors');

class AppController {
    public app: any;
    private log: debug.Debugger;
    private env: string;
   
    constructor(controllers: Controller[])  {
      this.app = express();
      this.log = debug('controller:app');
      this.env = this.app.get('env');
   
      this.connectToTheDatabase();
      this.initializeExpressMiddleware();
      this.initializeControllers(controllers);
      this.initializeErrorMiddleware();
      this.logEnvironment();
      // this.seedDatabase();
      // this.clearDatabase();
    }
   
     // MARK: - Public methods
    public listen() {
      const port = process.env.PORT || 3000;
      this.app.listen(port, () => this.log(`Listening on port ${port}...`));
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
      mongoose.connect(db, { useNewUrlParser: true })
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
    private clearDatabase() { 
      if (this.env !== 'production') { 
        PortfolioModel.collection.deleteMany({});
        StockModel.collection.deleteMany({});
        UserModel.collection.deleteMany({});
        QuoteModel.collection.deleteMany({});
      }
    }

    // MARK: - Seeds data base with default models
    private async seedDatabase() { 
      await StockModel.collection.insertMany(stockTemplates);
      await PortfolioModel.collection.insertMany(portfolioTemplates);
    }

  }

  export default AppController;