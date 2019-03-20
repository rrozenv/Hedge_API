"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppController_1 = __importDefault(require("./controllers/AppController"));
var UsersController_1 = __importDefault(require("./controllers/UsersController"));
var StocksController_1 = __importDefault(require("./controllers/StocksController"));
var PortfoliosController_1 = __importDefault(require("./controllers/PortfoliosController"));
var WatchlistController_1 = __importDefault(require("./controllers/WatchlistController"));
var appController = new AppController_1.default([
    new UsersController_1.default(),
    new StocksController_1.default(),
    new PortfoliosController_1.default(),
    new WatchlistController_1.default(),
]);
appController.listen();
