// Dependencies
import express from 'express';
import Joi from 'Joi';
import debug from 'debug';
import moment from 'moment';
// Middleware
import auth from '../middleware/auth';
import validateObjectId from '../middleware/validateObjectId';
import bodyValidation from '../middleware/joi';
// Models
import { HedgeFundModel, HedgeFundType } from '../models/hedgeFund.model';
import { HedgeFundPositionModel, HedgeFundPositionType } from '../models/hedgeFundPosition.model';
import { PortfolioModel, PortfolioType } from '../models/portfolio.model';
import { StockModel, StockType } from '../models/stock.model';
// Interfaces
import IController from '../interfaces/controller.interface';
import IStock from '../interfaces/stock.interface';
import IPortfolio from '../interfaces/portfolio.interface';
// Services
import IEXService from '../services/IEXService';
import APIError from '../util/Error';
import { createChartPerformanceResponse } from './PortfolioPerformanceController'

// Path
import Path from '../util/Path';

// MARK: - PortfoliosController
class HedgeFundsController implements IController {
    
    // MARK: - Properties
    public router = express.Router({});
    private log: debug.Debugger;
   
    // MARK: - Constructor
    constructor() {
      this.log = debug('controller:hedgeFunds');
      this.initializeRoutes();
    }
   
    private initializeRoutes() {
      this.router.get(Path.hedgeFunds, this.getHedgeFunds);
      this.router.get(`${Path.hedgeFunds}/:id/positions`, this.getHedgeFundPositions);
    }

    /// ** ---- GET ROUTES ---- **

    // MARK: - Get Hedge Funds
    private getHedgeFunds = async (req: any, res: any) => {
        // Find Hedge Funds
        const hedgeFunds = await HedgeFundModel.find() 

        // Send response 
        res.send({ hedgeFunds: hedgeFunds });
    }

    // MARK: - Get Positions for Hedge Fund
    private getHedgeFundPositions = async (req: any, res: any) => {
        // Find Hedge Fund Positions for `id`
        const hedgeFundPositions = await HedgeFundPositionModel.find({ 
            'hedgeFund._id': req.params.id
        })

        // Send response 
        res.send({ positions: hedgeFundPositions });
    }

}

export default HedgeFundsController;