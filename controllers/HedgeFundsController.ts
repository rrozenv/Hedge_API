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
import { HedgeFundModel } from '../models/hedgeFund.model';
import { HedgeFundPositionModel } from '../models/hedgeFundPosition.model';
// Interfaces
import IController from '../interfaces/controller.interface';
// Utils
import Path from '../util/Path';
import APIError from '../util/Error';

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
    // GET 
    this.router.get(Path.hedgeFunds, [auth], this.getHedgeFunds);
    this.router.get(`${Path.hedgeFunds}/:id/positions`, [auth, validateObjectId], this.getHedgeFundPositions);

    // POST
    this.router.post(Path.hedgeFunds, [auth, bodyValidation], this.createHedgeFund);
    this.router.post(`${Path.hedgeFunds}/:id/positions`, [auth, bodyValidation, validateObjectId], this.addHedgeFundPositions);
  }

  /// ** ---- GET ROUTES ---- **

  // MARK: - Get hedge funds
  private getHedgeFunds = async (req: any, res: any) => {
    // Find Hedge Funds
    const hedgeFunds = await HedgeFundModel.find()

    // Send response 
    res.send({ hedgeFunds: hedgeFunds });
  }

  // MARK: - Get all positions for hedge fund. 
  private getHedgeFundPositions = async (req: any, res: any) => {
    // Find Hedge Fund Positions for `id`
    const hedgeFundPositions = await HedgeFundPositionModel.find({
      'hedgeFund._id': req.params.id
    })

    // Send response 
    res.send({ positions: hedgeFundPositions });
  }

  /// ** ---- POST ROUTES ---- **

  // MARK: - Create hedge fund
  private createHedgeFund = async (req: any, res: any) => {
    // Create fund
    const hedgeFundModel = new HedgeFundModel({
      name: req.body.name,
      manager: req.body.manager
    })
    await hedgeFundModel.save();

    // Send response 
    res.send(hedgeFundModel);
  }

  // MARK: - Add positions to hedge fund
  private addHedgeFundPositions = async (req: any, res: any) => {
    // Find hedge fund by id 
    const hedgeFund = await HedgeFundModel.findById(req.params.id)
    if (!hedgeFund) return res.status(400).send(new APIError('Bad Request', `Hedge fund not found for: ${req.params.id}`));

    // Convert positions to models. 
    const positions: any[] = req.body.positions;
    const positionModels = await Promise.all(
      positions.map(async pos => {
        const model = new HedgeFundPositionModel({
          hedgeFund: hedgeFund,
          stockSymbol: pos.symbol,
          marketValue: pos.marketValue,
          purchaseDate: pos.purchaseDate
        });

        await model.save();

        return model
      })
    );

    // Send response.
    res.send(positionModels);
  }

}

export default HedgeFundsController;