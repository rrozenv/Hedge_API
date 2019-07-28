// Dependecies
import express from 'express';
import Joi from 'joi';
import debug from 'debug';
import mongoose from 'mongoose';
// Middleware
import auth from '../middleware/auth';
import bodyValidation from '../middleware/joi';
// Interfaces
import IController from '../interfaces/controller.interface';
import IPosition from '../interfaces/position.interface';
import IWatchlist from '../interfaces/watchlist.interface';
// Models
import { WatchlistModel } from '../models/watchlist.model';
import { UserPositionModel } from '../models/userPosition.model';
// Services
import IEXService from '../services/IEXService';
// Path
import Path from '../util/Path';

// MARK: - WatchlistsController
class PositionsController implements IController {

  // MARK: - Properties
  public router = express.Router({});
  private iex_service: IEXService;
  private log: debug.Debugger;

  // MARK: - Constructor
  constructor() {
    this.iex_service = new IEXService();
    this.log = debug('controller:positions');
    this.initializeRoutes();
  }

  // MARK: - Create Routes
  private initializeRoutes() {
    this.router.get(`${Path.userPositions}/:id`, [auth, bodyValidation], this.getPosition);
    this.router.put(`${Path.updateUserPosition}/:id`, [auth, bodyValidation], this.updatePosition);
    this.router.post(Path.createUserPositions, [auth, bodyValidation], this.createPosition);
  }

  // MARK: - Get portfolio by id
  private getPosition = async (req: any, res: any) => {
    const position = await UserPositionModel.findById(req.params.id);
    if (!position) return res.status(400).send(`Position not found for: ${req.params.id}`)
    res.send(position);
  };

  /// ** ---- POST ROUTES ---- **
  // MARK: - Create watchlist
  private createPosition = async (req: any, res: any) => {
    // Find watchlists for given id's
    const watchlistIds: mongoose.Schema.Types.ObjectId[] = req.body.watchlistIds;
    const watchlists = await WatchlistModel
      .find({ _id: { $in: watchlistIds } });

    console.log(`wathlists: ${watchlists}`);

    console.log(req.body.stock);

    // Create a new position in every watchlist
    const newPositions = await Promise.all(
      watchlists.map(async (w) => {
        const position = new UserPositionModel({
          stock: req.body.stock,
          buyPricePerShare: req.body.buyPricePerShare,
          shares: req.body.shares,
          watchlistId: w._id
        });
        await position.save();
        w.positions.push(position._id);
        w.tickers.push(position.stock.symbol);
        await w.save();
        return position
      })
    );

    console.log(`pos: ${newPositions}`);

    // Return positions 
    res.send(newPositions);
  }

  /// ** ---- PUT ROUTES ---- **
  // MARK: - Update position
  private updatePosition = async (req: any, res: any) => {
    console.log(`updating: ${req.body}`);
    const position = await UserPositionModel.findByIdAndUpdate(req.params.id,
      {
        buyPricePerShare: req.body.buyPricePerShare,
        shares: req.body.shares
      },
      { new: true }
    );

    if (!position) return res.status(400).send(`Position not found for: ${req.params.id}`);

    res.send(position);
  }

}

export default PositionsController; 