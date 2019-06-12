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
import { PortfolioModel, PortfolioType } from '../models/portfolio.model';
import { DailyPortfolioPerformanceModel, DailyPortfolioPerformanceType } from '../models/dailyPortfolioPerformance.model';
import { StockModel, StockType } from '../models/stock.model';
// Interfaces
import IController from '../interfaces/controller.interface';
import IStock from '../interfaces/stock.interface';
import IPortfolio from '../interfaces/portfolio.interface';
// Services
import IEXService from '../services/IEXService';
import APIError from '../util/Error';
import { createChartPerformanceResponse } from './PortfolioPerformanceController'

// Path
import Path from '../util/Path';

// MARK: - PortfoliosController
class PortfoliosController implements IController {
    
    // MARK: - Properties
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
      this.router.get(Path.dashboard, this.getDashboardPortfolios);
    //   this.router.get(Path.portfolios, auth, this.getPortfolios);
    //   this.router.get(`${Path.portfolios}/:id`, [auth, validateObjectId], this.getPortfolio);
      this.router.post(Path.portfolios, [auth, bodyValidation], this.createPortfolio);
    }

    /// ** ---- GET ROUTES ---- **

    // MARK: - Get dashboard
    private getDashboardPortfolios = async (req: any, res: any) => {
        // Find portfolios
        const portfolios = await PortfolioModel.find() 

        // Create response 
        const modifiedPortfolios = await Promise.all(
            portfolios.map(async (port) => { 
                const performance = await createChartPerformanceResponse(port, 'year')
                return { 
                    id: port._id,
                    name: port.name,
                    description: port.description,
                    performance: performance,
                    positions: port.positions
                }
            })
        );

        // Send response 
        res.send({ portfolios: modifiedPortfolios });
    }

        // MARK: - Get portfolio by id
    // private getPortfolio = async (req: any, res: any) => { 
    //     // Find portfolio by id
    //     let portfolio = await PortfolioModel.findById(req.params.id); 
    //     if (!portfolio) return res.status(400).send(`Portfolio not found for: ${req.params.id}`)

    //     // Try to fetch updated stock quotes and return updated portfolio
    //     // If call to IEX fails log error and return portfolio 
    //     try { 
    //         const updatedStocks = await this.iex_service.fetchQuotesForStocks(portfolio.stocks);
    //         portfolio.stocks = updatedStocks;
    //         await portfolio.save();
    //         res.send(portfolio);
    //     } catch(error) { 
    //         this.log(error);
    //         res.send(portfolio);
    //     }
    // };
    
    // MARK: - Get Old Dashboard
    // private getPortfolios = async (req: any, res: any) => {
    //     // Find portfolios
    //     const portfolios = await PortfolioModel.find()

    //     // If first portfolio return empty array 
    //     let firstPortfolio = portfolios.shift();
    //     if (!firstPortfolio) return res.send(portfolios)
        
    //     // Try to fetch updated stocks for first portoflio only
    //     try { 
    //         const updatedStocks = await this.iex_service.fetchQuotesForStocks(firstPortfolio.stocks);
    //         firstPortfolio.stocks = updatedStocks;
    //         await firstPortfolio.save();
    //     } catch(error) { 
    //         this.log(error);
    //     }
        
    //     // Return all portfolios with first having updated stock quotes
    //     res.send({ portfolios: [firstPortfolio].concat(portfolios) });
    // }



    /// ** ---- POST ROUTES ---- **
    // MARK: - POST API's
    private createPortfolio = async (req: any, res: any) => { 
        // Create stocks
        const name: string = req.body.name;
        const description: string = req.body.description;
        const stocks: IStock[] = req.body.stocks;

        try { 
            // Create stocks 
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
        } catch (err) { 
            // Return error if calling IEX for stock quotes fails
            res.status(500).send(
                new APIError(
                    'Interal Server Error', 
                    'Failed to fetch stock quotes for portfolio'
                )
            )
        }
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
    
}

export default PortfoliosController;