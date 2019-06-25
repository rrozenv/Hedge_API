// Dependecies
import express from 'express';
import Joi from 'Joi';
import debug from 'debug';
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
class WatchlistsController implements IController {

    // MARK: - Properties
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
        this.router.get(Path.watchlists, auth, this.getWatchlists);
        this.router.post(Path.watchlists, [auth, bodyValidation], this.createWatchlist);
    }

    /// ** ---- GET ROUTES ---- **
    // MARK: - Get all users watchlists
    private getWatchlists = async (req: any, res: any) => {
        const watchlists = await WatchlistModel
            .find({ user: req.user })
            .populate('positions')

        res.send(watchlists);
    }

    /// ** ---- POST ROUTES ---- **
    // MARK: - Create watchlist
    private createWatchlist = async (req: any, res: any) => {
        const name: string = req.body.name;
        const positions: IPosition[] = req.body.positions;

        // Create and save position models
        const positionModels = positions.map((p) => {
            return new PositionModel({
                stock: p.stock,
                buyPricePerShare: p.buyPricePerShare,
                shares: p.shares,
            });
        });
        const savedPositions = await PositionModel.collection.insertMany(positionModels);

        // Create watchlist with positions
        const watchlist = new WatchlistModel({
            name: name,
            user: req.user,
            positions: savedPositions.ops
        });
        await watchlist.save();

        // Return watchlist 
        res.send({
            ...watchlist.toObject(),
            positions: savedPositions.ops
        });
    }

}

export default WatchlistsController;