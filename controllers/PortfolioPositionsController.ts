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
import { PortfolioModel, PortfolioType } from '../models/portfolio.model';
import { DailyPortfolioPerformanceModel, DailyPortfolioPerformanceType } from '../models/dailyPortfolioPerformance.model';
import { StockModel, StockType } from '../models/stock.model';
import { PositionModel, PositionType } from '../models/position.model';
// Interfaces
import IController from '../interfaces/controller.interface';
import IStock from '../interfaces/stock.interface';
import IPortfolio from '../interfaces/portfolio.interface';
// Services
import IEXService from '../services/IEXService';
import APIError from '../util/Error';
// Path
import Path from '../util/Path';

// MARK: - PortfoliosController
class PortfolioPositionsController implements IController {
    
    // MARK: - Properties
    public router = express.Router({});
    private log: debug.Debugger;
   
    // MARK: - Constructor
    constructor() {
      this.log = debug('controller:portfolioPerformance');
      this.initializeRoutes();
    }
   
    private initializeRoutes() {
      // this.router.get(`${Path.portfolios}/:id/chart`, this.getPerformance);
    }

    /// ** ---- GET ROUTES ---- **

    /// ** ---- POST ROUTES ---- **
    private createPosition = async (req: any, res: any) => { 
        const position = await createPosition(req.body)
        res.send(position);
    }
}

const createPosition = async (position: any) => { 
    const model = new PositionModel({ 
        stock: position.stock,
        buyPricePerShare: position.buyPricePerShare,
        shares: position.shares,
        type: position.type,
        status: position.status,
        weightPercentage: position.weightPercentage ? position.weightPercentage : 0.0,
        investmentSummaryGroups: position.investmentSummaryGroups,
        hedgeFundPositions: position.hedgeFundPositions
    });
    await model.save();
    return model;
}

export { PortfolioPositionsController, createPosition }