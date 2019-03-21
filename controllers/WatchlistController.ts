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
class WatchlistsController implements IController {
    
    // MARK: - Properties
    public path = '/watchlists';
    public router = express.Router({});
    private iex_service: IEXService;
    private log: debug.Debugger;

    // MARK: - Constructor
    constructor() {
      this.iex_service = new IEXService();
      this.log = debug('controller:watchlists');
      this.initializeRoutes();
    }
   
    // MARK: - Create Routes
    private initializeRoutes() {
      this.router.get(this.path, auth, this.getWatchlists);
      this.router.post(this.path, auth, this.createWatchlist);
    }

    /// ** ---- GET ROUTES ---- **
    // MARK: - Get all users watchlists
    private getWatchlists = async (req: any, res: any) => { 
        const watchlists = await WatchlistModel
            .find({ user: req.user })
            .populate({ path: 'positions', model: 'Position' })

        res.send({ watchlists: watchlists });
    }

    /// ** ---- POST ROUTES ---- **
    // MARK: - Create watchlist
    private createWatchlist = async (req: any, res: any) => { 
        // Errors
        const { error } = this.validateCreate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        const name: string = req.body.name;
        const positions: IPosition[] = req.body.positions;

        // Create watchlist with no positions so id is set
        const watchlist = new WatchlistModel({ 
            name: name,
            user: req.user,
            positions: [] 
        });
        await watchlist.save();

        // Create and save position models
        const positionModels = positions.map((p) => { 
            return new PositionModel({ 
                watchlists: [watchlist],
                stock: p.stock,
                buyPricePerShare: p.buyPricePerShare,
                shares: p.shares,
            });
        });
        const savedPositions = await PositionModel.collection.insertMany(positionModels);

        // Update watchlist with positions 
        await WatchlistModel.findOneAndUpdate(
            { _id: watchlist._id },
            { $set: { positions: savedPositions.ops } }
        )
        
        // Get watchlist with positions 
        const updatedWatchlist = await WatchlistModel
            .findOne({ _id: watchlist._id })
            .populate({ path: 'positions', model: 'Position' })
        
        // Return watchlist
        res.send(updatedWatchlist);
    }

    /// ** ---- VALIDATION ---- **
    // MARK: - User body validation 
    private validateCreate = (watchlist: IWatchlist) => {
        const schema = {
          name: Joi.string().min(1).max(100).required(),
          positions: Joi.array()
        };
    
        return Joi.validate(watchlist, schema);
    }

}

export default WatchlistsController;