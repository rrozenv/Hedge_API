import express from 'express';
import IController from '../interfaces/controller.interface';
import { StockModel } from '../models/stock.model';
import { WatchlistModel, WatchlistType } from '../models/watchlist.model';
import IEXService from '../services/IEXService';

class StocksController implements IController {
    public path = '/stocks';
    public router = express.Router({});
    private iex_service: IEXService;
   
    // MARK: - Constructor
    constructor() {
      this.iex_service = new IEXService();
      this.initializeRoutes();
    }
   
    private initializeRoutes() {
      this.router.get(this.path, this.getStocks);
      this.router.post(`${this.path}/:id`, this.getStock);
      this.router.post(this.path, this.createStock);
    }

    // MARK: - GET API's
    private getStocks = async (req: any, res: any) => { 
        const stocks = await StockModel.find()
  
        const quotes = await this.iex_service.fetchQuotes(stocks.map(s => s.quote.symbol), ['quote']);

        const updatedStocks = stocks.map((stock, _) => { 
            const quote = quotes.filter(quote => quote.symbol == stock.quote.symbol).pop()
            if (quote !== undefined) stock.quote = quote
            return stock
        });
   
        res.send(updatedStocks);
    }

    // MARK: - Get portfolio by id
    private getStock = async (req: any, res: any) => { 
        const stock = await StockModel.findById(req.params.id)  
        
        if (stock) { 
            const watchlists = await WatchlistModel
                .find({ user: req.user._id })
        
            res.send({ 
                stock: stock,
                watchlists: watchlists 
            })
        }

        res.status(400).send(`Stock not found for: ${req.params.id}`)
    };

     // MARK: - POST API's
    private createStock = async (req: any, res: any) => { 
        const { symbol, companyName } = req.body;

        const stock = new StockModel({ 
            symbol: symbol,
            companyName: companyName,
            imageUrl: '',
            sector: 'technology',
            quote: { 
                symbol: symbol,
                companyName: companyName,
                latestPrice: 100.0,
                changePercent: 2.0
            }
        });
    
        await stock.save();
    
        res.send(stock);
    }

}

export default StocksController;