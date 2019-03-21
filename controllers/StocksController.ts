// Dependencies
import express from 'express';
// Middleware
import auth from '../middleware/auth';
import validateObjectId from '../middleware/validateObjectId';
// Interfaces
import IController from '../interfaces/controller.interface';
// Models
import { StockModel } from '../models/stock.model';
import { WatchlistModel } from '../models/watchlist.model';
// Services
import IEXService from '../services/IEXService';

// MARK: - StocksController
class StocksController implements IController {
    
    // MARK: - Properties
    public path = '/stocks';
    public router = express.Router({});
    private iex_service: IEXService;
   
    // MARK: - Constructor
    constructor() {
      this.iex_service = new IEXService();
      this.initializeRoutes();
    }
   
    // MARK: - Create routes
    private initializeRoutes() {
      this.router.post(`${this.path}/:id`, [auth, validateObjectId], this.getStock);
    }

    /// ** ---- GET ROUTES ---- **
    // MARK: - Get portfolio by id
    private getStock = async (req: any, res: any) => { 
        // Find stock if exists
        const stock = await StockModel.findById(req.params.id)  
        if (!stock) return res.status(400).send(`Stock not found for: ${req.params.id}`)

        // Find all wathlists for user. Client can decide if stock belongs in any watchlist
        const watchlists = await WatchlistModel.find({ user: req.user._id })
    
        res.send({ 
            stock: stock,
            watchlists: watchlists 
        })
    };

}

export default StocksController;