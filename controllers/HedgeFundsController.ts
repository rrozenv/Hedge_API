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
      this.router.post(Path.hedgeFunds, this.createHedgeFund);
      this.router.post(`${Path.hedgeFunds}/:id/positions`, this.addHedgeFundPositions);
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

    // MARK: - Get Positions for Hedge Fund
    private createHedgeFund = async (req: any, res: any) => {
      const name: string = req.body.name;
      const manager: string = req.body.manager;
      const hedgeFundModel = new HedgeFundModel({ 
        name: name,
        manager: manager
      })

      await hedgeFundModel.save();

      res.send(hedgeFundModel);
    }

    // MARK: - Add positions to hedge fund
    private addHedgeFundPositions = async (req: any, res: any) => {
     const hedgeFund = await HedgeFundModel.findById(req.params.id)
     if (!hedgeFund) return res.status(400).send(`Hedge fund not found for: ${req.params.id}`)     
     const positions: any[] = req.body.positions;
 
     const positionModels =  await Promise.all( 
       positions.map(async pos => {
         const model = new HedgeFundPositionModel({ 
           hedgeFund: hedgeFund,
           stockSymbol: pos.symbol,
           marketValue: pos.marketValue,
           purchaseDate: pos.purchaseDate
         })
         await model.save();
         return model
       })
     );
    
     res.send(positionModels);
    }

}

export default HedgeFundsController;