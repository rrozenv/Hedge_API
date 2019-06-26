// Dependencies
import express from 'express';
import Joi from 'joi';
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
import { HedgeFundPositionModel, HedgeFundPositionType } from '../models/hedgeFundPosition.model';
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
    // GET
    this.router.get(`${Path.positions}/:id/hedgeFundPositions`, [auth, validateObjectId], this.getHedgeFundPositions);
  }

  /// ** ---- GET ROUTES ---- **
  // MARK: - Get Positions for Hedge Fund
  private getHedgeFundPositions = async (req: any, res: any) => {
    const portfolioPosition = await PositionModel
      .findById(req.params.id)
      .populate('hedgeFundPositions');

    // Send response 
    res.send({ positions: portfolioPosition!.hedgeFundPositions });
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