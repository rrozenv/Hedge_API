// Dependecies
import express from 'express';
import Joi from 'Joi';
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
import { PositionModel } from '../models/position.model';
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
      this.router.get(`${Path.positions}/:id`, this.getPosition);
      this.router.post(Path.createPositions, [auth, bodyValidation], this.createPosition);
      this.router.put(Path.updatePositions, [auth, bodyValidation], this.updatePosition);
    }

    // MARK: - Get portfolio by id
    private getPosition = async (req: any, res: any) => { 
        const position = await PositionModel.findById(req.params.id); 
        if (!position) return res.status(400).send(`Position not found for: ${req.params.id}`)
        res.send(position);
    };

    /// ** ---- POST ROUTES ---- **
    // MARK: - Create watchlist
    private createPosition = async (req: any, res: any) => { 
        // Find watchlists for given id's
        const watchlistIds: mongoose.Schema.Types.ObjectId[] = req.body.watchlistIds
        const watchlists = await WatchlistModel
          .find({ _id: { $in: watchlistIds } })

        // Create a new position in every watchlist
        const newPositions = await Promise.all(
          watchlists.map(async (w) => { 
            const position = new PositionModel({ 
              stock: req.body.stock,
              buyPricePerShare: req.body.buyPricePerShare,
              shares: req.body.shares
            });
            await position.save();
            w.positions.push(position._id)
            await w.save();
            return position
          })
        );

        // Return positions 
        res.send(newPositions);
    }

    /// ** ---- PUT ROUTES ---- **
    // MARK: - Update position
    private updatePosition = async (req: any, res: any) => { 
      const position = await PositionModel.findByIdAndUpdate(req.params.id,
        { 
          buyPricePerShare: req.body.buyPricePerShare,
          shares: req.body.shares
        }, { new: true });

        if (!position) return res.status(400).send(`Position not found for: ${req.params.id}`);

        res.send(position);
    } 

}

export default PositionsController; 