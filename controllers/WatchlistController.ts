// Dependecies
import express from 'express';
import Joi from 'joi';
import debug from 'debug';
// Middleware
import auth from '../middleware/auth';
import bodyValidation from '../middleware/joi';
// Interfaces
import IController from '../interfaces/controller.interface';
import IPosition from '../interfaces/position.interface';
import IWatchlist from '../interfaces/watchlist.interface';
// Models
import { WatchlistModel, findWatchlistSummaries } from '../models/watchlist.model';
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
        // this.router.get(Path.watchlists, auth, this.getWatchlists);
        this.router.get(`${Path.watchlists}/summaries`, [auth], this.getWatchlistSummaries);
        this.router.get(`${Path.watchlists}/:id`, [auth], this.getWatchlist);

        // this.router.post(Path.watchlists, [auth, bodyValidation], this.createWatchlist);
    }

    /// ** ---- GET ROUTES ---- **
    // MARK: - Get all users watchlists
    private getWatchlists = async (req: any, res: any) => {
        const watchlists = await WatchlistModel
            .find({ user: req.user })
            .populate('positions')

        res.send(watchlists);
    }

    private getWatchlist = async (req: any, res: any) => {
        // Find watchlist
        const watchlist: any = await WatchlistModel
            .findById(req.params.id)
            .populate('positions');
        if (!watchlist) return res.status(400).send(`Watchlist not found for: ${req.params.id}`);

        // Update all positions in watchlist for latest stock price 
        const updatedPositions = await Promise.all(
            watchlist.positions.map(async (p: any) => {
                const quote = await this.iex_service.fetchQuote(p.stock.symbol);
                p.stock.quote = quote;
                await p.save();
                return p
            })
        );

        watchlist.positions = updatedPositions
        await watchlist.save();

        // Send response
        res.send({
            summary: {
                id: watchlist.id,
                name: watchlist.name,
                tickers: watchlist.tickers
            },
            positions: watchlist.positions
        });
    }

    // MARK: - Get all users watchlists
    private getWatchlistSummaries = async (req: any, res: any) => {
        const watchlists = await findWatchlistSummaries(req.user);
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