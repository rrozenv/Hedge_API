// Dependencies
import express from 'express';
import Joi from 'Joi';
import debug from 'debug';
// Middleware
import auth from '../middleware/auth';
import validateObjectId from '../middleware/validateObjectId';
// Models
import { PortfolioModel } from '../models/portfolio.model';
import { StockModel, StockType } from '../models/stock.model';
// Interfaces
import IController from '../interfaces/controller.interface';
import IStock from '../interfaces/stock.interface';
import IPortfolio from '../interfaces/portfolio.interface';
// Services
import IEXService from '../services/IEXService';

// MARK: - PortfoliosController
class PortfoliosController implements IController {
    
    // MARK: - Properties
    public path = '/portfolios';
    public router = express.Router({});
    private iex_service: IEXService;
    private log: debug.Debugger;
   
    // MARK: - Constructor
    constructor() {
      this.iex_service = new IEXService();
      this.log = debug('controller:portfolios');
      this.initializeRoutes();
    }
   
    private initializeRoutes() {
      this.router.get(this.path, auth, this.getDashboard);
      this.router.get(`${this.path}/:id`, [auth, validateObjectId], this.getPortfolio);
      this.router.post(this.path, auth, this.createPortfolio);
    }

    /// ** ---- GET ROUTES ---- **
    // MARK: - Get dashboard
    private getDashboard = async (req: any, res: any) => {
        // Find portfolios
        const portfolios = await PortfolioModel.find()

        // If first portfolio return empty array 
        let firstPortfolio = portfolios.shift();
        if (!firstPortfolio) return res.send(portfolios)
        
        // Try to fetch updated stocks for first portoflio only
        try { 
            const updatedStocks = await this.iex_service.fetchQuotesForStocks(firstPortfolio.stocks);
            firstPortfolio.stocks = updatedStocks;
            await firstPortfolio.save();
        } catch(error) { 
            this.log(error);
        }
        
        // Return all portfolios with first having updated stock quotes
        res.send({ portfolios: [firstPortfolio].concat(portfolios) });
    }

    // MARK: - Get portfolio by id
    private getPortfolio = async (req: any, res: any) => { 
        // Find portfolio by id
        let portfolio = await PortfolioModel.findById(req.params.id)  
            .populate({ path: 'stocks', model: 'Stock' })
        
        if (portfolio) { 
            // Try to fetch updated stock quotes and return updated portfolio
            // If call to IEX fails log error and return portfolio 
            try { 
                const updatedStocks = await this.iex_service.fetchQuotesForStocks(portfolio.stocks);
                portfolio.stocks = updatedStocks;
                await portfolio.save();
                res.send(portfolio);
            } catch(error) { 
                this.log(error);
                res.send(portfolio);
            }
        }

        // Return error if portfolio not found
        res.status(400).send(`Portfolio not found for: ${req.params.id}`)
    };

    /// ** ---- POST ROUTES ---- **
    // MARK: - POST API's
    private createPortfolio = async (req: any, res: any) => { 
        // Errors
        const { error } = this.validateCreate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        // Create stocks
        const name: string = req.body.name;
        const description: string = req.body.description;
        const stocks: IStock[] = req.body.stocks;
        const newStocks = await Promise.all(
            stocks.map(async (stock) => await this.createStock(stock))
        );

        // Create portfolio 
        const portfolio = new PortfolioModel({ 
            name: name,
            description: description,
            stocks: newStocks,
        });
        await portfolio.save();
    
        // Return portfolio 
        res.send(portfolio);
    }

    /// ** ---- HELPER METHODS ---- **
    // MARK: Create stock and save
    private createStock = async (stock: IStock): Promise<StockType> => { 
        const quotes = await this.iex_service.fetchQuotes([stock.symbol], ['quote']);

        const stockModel = new StockModel({ 
            symbol: stock.symbol,
            imageUrl: stock.imageUrl,
            sector: stock.sector,
            quote: quotes[0]
        });
    
        return stockModel;
    }

    /// ** ---- VALIDATION ---- **
    // MARK: - User body validation 
    private validateCreate = (portfolio: IPortfolio) => {
        const schema = {
          name: Joi.string().min(1).max(100).required(),
          description: Joi.string().required(),
          stocks: Joi.array()
        };
    
        return Joi.validate(portfolio, schema);
    }
    
}

export default PortfoliosController;