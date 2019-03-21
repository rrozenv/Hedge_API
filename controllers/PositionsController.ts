// Dependecies
import express from 'express';
import Joi from 'Joi';
import debug from 'debug';
// Middleware
import auth from '../middleware/auth';
// Interfaces
import IController from '../interfaces/controller.interface';
import IPosition from '../interfaces/position.interface';
import IWatchlist from '../interfaces/watchlist.interface';
// Models
import { WatchlistModel } from '../models/watchlist.model';
import { PositionModel } from '../models/position.model';
// Services
import IEXService from '../services/IEXService';

// MARK: - WatchlistsController
class PositionsController implements IController {
    
    // MARK: - Properties
    public path = '/positions';
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
      this.router.post(this.path, auth, this.createPosition);
    }

    /// ** ---- POST ROUTES ---- **
    // MARK: - Create watchlist
    private createPosition = async (req: any, res: any) => { 
        // Errors
        // const { error } = this.validateCreate(req.body); 
        // if (error) return res.status(400).send(error.details[0].message);
      
        // Create and save position 
        const position = new PositionModel({ 
            watchlists: [req.body.watchlistId],
            stock: req.body.stock,
            buyPricePerShare: req.body.buyPricePerShare,
            shares: req.body.shares
        });
        await position.save();

        // Add position to watchlist
        await WatchlistModel.findOneAndUpdate(
            { _id: req.body.watchlistId },
            { $push: { positions: position } }
        );
        
        res.send(position);
    }

    /// ** ---- VALIDATION ---- **
    // MARK: - User body validation 
    private validateCreate = (position: any) => {
        const schema = {
          shares: Joi.number().required(),
          buyPricePerShare: Joi.number(),
          watchlistId: Joi.string()
        };
    
        return Joi.validate(position, schema);
    }

}

export default PositionsController; 