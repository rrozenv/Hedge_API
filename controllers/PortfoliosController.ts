// Dependencies
import express from 'express';
import Joi from 'joi';
import debug from 'debug';
import moment from 'moment';
import _ from 'lodash';
// Middleware
import auth from '../middleware/auth';
import validateObjectId from '../middleware/validateObjectId';
import bodyValidation from '../middleware/joi';
// Models
import { PortfolioModel, PortfolioType, deleteByName } from '../models/portfolio.model';
import { DailyPortfolioPerformanceModel, DailyPortfolioPerformanceType } from '../models/dailyPortfolioPerformance.model';
import { StockModel, StockType } from '../models/stock.model';
import { PositionModel } from '../models/position.model';
// Interfaces
import IController from '../interfaces/controller.interface';
import IStock from '../interfaces/stock.interface';
import IPortfolio from '../interfaces/portfolio.interface';
import IDailyPortfolioPerformance from '../interfaces/dailyPortfolioPerformance.interface';
import IPerformance from '../interfaces/performance.interface';
// Services
import IEXService from '../services/IEXService';
import APIError from '../util/Error';
import { createChartPerformanceResponse, createChartPerformanceModels } from './PortfolioPerformanceController'
import { createPosition } from './PortfolioPositionsController'

// Path
import Path from '../util/Path';
import IPosition from '../interfaces/position.interface';

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
        // GET
        this.router.get(Path.dashboard, [auth], this.getDashboardPortfolios);
        this.router.get(`${Path.portfolios}/:id/positions`, [auth, validateObjectId], this.getPortfolioPositions);
        this.router.get(`${Path.portfolios}/:id/performance/:range`, [auth, validateObjectId], this.getPortfolioPerformance);

        // POST
        this.router.post(Path.portfolios, this.createPortfolio);
        this.router.put(`${Path.portfolios}/:id`, this.updatePortfolio);
    }

    /// ** ---- GET ROUTES ---- **

    // MARK: - Get dashboard
    private getDashboardPortfolios = async (req: any, res: any) => {
        // Find portfolios
        const portfolios = await PortfolioModel.find()

        // Create response 
        const modifiedPortfolios = await Promise.all(
            portfolios.map(async (port) => {
                return await this.createPortfolioResponse(port, req.query.range)
            })
        );

        // Send response 
        res.send({ portfolios: modifiedPortfolios });
    }

    private createPortfolioResponse = async (port: PortfolioType, range: string) => {
        const performance = await createChartPerformanceResponse(port, range);
        return {
            id: port._id,
            name: port.name,
            description: port.description,
            rebalanceDate: port.rebalanceDate,
            benchmarkType: port.benchmarkType,
            performance: performance,
            positions: port.positions
        }
    }

    private getPortfolioPositions = async (req: any, res: any) => {
        // Find portfolio posiitons. 
        const portfolio = await PortfolioModel
            .findById(req.params.id)
            .populate('positions')

        if (!portfolio) return res.status(400).send(
            new APIError('Bad Request', `Portfolio not found for: ${req.params.id}`)
        );

        // Update all positions in watchlist for latest stock price 
        const updatedPositions = await Promise.all(
            portfolio.positions.map(async (p: any) => {
                const quote = await this.iex_service
                    .fetchQuote(p.stock.symbol)
                    .catch((e) => console.log(e));
                console.log(quote);
                p.stock.quote = quote;
                await p.save();
                return p
            })
        );

        portfolio.positions = updatedPositions
        await portfolio.save();

        // Send response.
        res.send(portfolio);
    }

    private getPortfolioPerformance = async (req: any, res: any) => {
        // Find portfolio by id. 
        const portfolio = await PortfolioModel.findById(req.params.id)
        if (!portfolio) return res.status(400).send(
            new APIError('Bad Request', `Portfolio not found for: ${req.params.id}`)
        )

        // Create chart perfromance.
        const performance = await createChartPerformanceResponse(portfolio, req.params.range)

        // Send response.
        res.send(performance);
    }

    /// ** ---- POST ROUTES ---- **

    // MARK: - Create portfolio
    private createPortfolio = async (req: any, res: any) => {
        const name: string = req.body.name;
        await deleteByName(name);

        const description: string = req.body.description;
        const rebalanceDate: string = req.body.rebalanceDate;
        const benchmarkType: string = req.body.benchmarkType;
        const positions: any[] = req.body.positions;
        const chartPoints: IPerformance[] = req.body.chartPoints;

        const positionModels = await Promise.all(
            positions.map(async pos => {
                return await createPosition(pos);
            })
        );

        const portfolio = new PortfolioModel({
            name: name,
            description: description,
            rebalanceDate: rebalanceDate,
            benchmarkType: benchmarkType,
            positions: positionModels
        })

        const savedPort: any = await portfolio.save();
        await createChartPerformanceModels(savedPort, chartPoints);

        const performance: any = await createChartPerformanceResponse(savedPort, 'all');
        const response = {
            id: savedPort._id,
            name: savedPort.name,
            description: savedPort.description,
            rebalanceDate: savedPort.rebalanceDate,
            benchmarkType: savedPort.benchmarkType,
            performance: performance,
            positions: savedPort.positions.map((p: any) => p._id)
        }

        res.send(response);
    }

    // MARK: - Update portfolio 
    private updatePortfolio = async (req: any, res: any) => {
        const positions: any[] = req.body.positions ? req.body.positions : [];
        const positionModels = await Promise.all(
            positions.map(async pos => {
                return await createPosition(pos);
            })
        );

        const updateFields = {
            name: req.body.name,
            description: req.body.description,
            rebalanceDate: req.body.rebalanceDate,
            benchmarkType: req.body.benchmarkType,
            positions: (positionModels && positionModels.length) ? positionModels : undefined
        }

        const validUpdateFields = _.pickBy(updateFields, _.identity);
        const portfolio = await PortfolioModel.findByIdAndUpdate(
            req.params.id,
            validUpdateFields,
            { new: true }
        );

        if (!portfolio) return res.status(400).send(
            new APIError('Bad Request', `Portfolio not found for: ${req.params.id}`)
        );
        res.send(portfolio);
    }

}

export default PortfoliosController;



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
    // private createPortfolio = async (req: any, res: any) => { 
    //     // Create stocks
    //     const name: string = req.body.name;
    //     const description: string = req.body.description;
    //     const stocks: IStock[] = req.body.stocks;

    //     try { 
    //         // Create stocks 
    //         const newStocks = await Promise.all(
    //             stocks.map(async (stock) => await this.createStock(stock))
    //         );

    //         // Create portfolio 
    //         const portfolio = new PortfolioModel({ 
    //             name: name,
    //             description: description,
    //             stocks: newStocks,
    //         });
    //         await portfolio.save();

    //         // Return portfolio 
    //         res.send(portfolio);
    //     } catch (err) { 
    //         // Return error if calling IEX for stock quotes fails
    //         res.status(500).send(
    //             new APIError(
    //                 'Interal Server Error', 
    //                 'Failed to fetch stock quotes for portfolio'
    //             )
    //         )
    //     }
    // }