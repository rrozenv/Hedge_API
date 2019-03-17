"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express from 'express';
// import mongoose from 'mongoose';
// import config from 'config';
// import debug from 'debug';
// import stocks from './routes/stocks';
var AppController_1 = __importDefault(require("./controllers/AppController"));
var UsersController_1 = __importDefault(require("./controllers/UsersController"));
var StocksController_1 = __importDefault(require("./controllers/StocksController"));
// const log = debug('app:startup');
// const app = express();
var appController = new AppController_1.default([
    new UsersController_1.default(),
    new StocksController_1.default()
]);
appController.listen();
// // Connect to data base.
// mongoose.connect(config.get('db-host'), { useNewUrlParser: true })
//       .then(() => log('Connected to MongoDB...'))
//       .catch(err => log('Could not connect to MongoDB...'));
// // Routes. 
// app.use(express.json({}));
// app.use('/api/stocks', stocks);
// // Connect port.
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));
