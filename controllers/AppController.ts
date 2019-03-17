import express from 'express';
import mongoose from 'mongoose';
import config from 'config';
import debug from 'debug';
import Controller from '../interfaces/controller.interface'

class AppController {
    public app: any;
    private log: debug.Debugger;
   
    constructor(controllers: Controller[]) {
      this.app = express();
      this.log = debug('controller:app');
   
      this.connectToTheDatabase();
      this.initializeMiddleware();
      this.initializeControllers(controllers);
      this.logEnvironment();
    }
   
     // MARK: - Public methods
    public listen() {
      const port = process.env.PORT || 3000;
      this.app.listen(port, () => this.log(`Listening on port ${port}...`));
    }
   
    // MARK: - Initalize middleware
    private initializeMiddleware() {
      this.app.use(express.json({}));
    }
   
    // MARK: - Initalize controllers
    private initializeControllers(controllers: Controller[]) {
      controllers.forEach((controller) => {
        this.app.use('/api', controller.router);
      });
    }
   
    // MARK: - Connect to data base
    private connectToTheDatabase() {
      mongoose.connect(config.get('db-host'), { useNewUrlParser: true })
              .then(() => this.log('Connected to MongoDB...'))
              .catch(err => this.log('Could not connect to MongoDB...'));
    }

    private logEnvironment() { 
        const env: string = this.app.get('env')
        switch (env) {
          case 'development':
            this.log('Running Dev...')
            break;
          case 'staging':
            this.log('Running Staging...')
            break;
          case 'production':
            this.log('Running Production...')
            break;
          default: 
            this.log('NODE_ENV not set!')
            break;
        };
    }

  }
   
  export default AppController;