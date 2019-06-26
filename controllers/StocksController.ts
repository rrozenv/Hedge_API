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
import APIError from '../util/Error';
// Path
import Path from '../util/Path';

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
    this.router.get(`${Path.stocks}/:ticker`, [auth], this.getStockQuote);
    this.router.get(`${Path.stocks}/:ticker/performance/:range`, [auth], this.getStockChart);
    this.router.get(`${Path.stocks}/:id`, [auth, validateObjectId], this.getPrimaryStockData);
  }

  /// ** ---- GET ROUTES ---- **
  private getStockQuote = async (req: any, res: any) => {
    try {
      const quote = await this.iex_service.fetchQuote(req.params.ticker)
      res.send(quote);
    } catch (error) {
      res.status(400).send(
        new APIError(
          'Bad Request',
          `Request failed for stock: ${req.params.ticker}`
        )
      );
    }
  };

  private getStockChart = async (req: any, res: any) => {
    try {
      const chartData: any[] = await this.iex_service.fetchChart(req.params.ticker, req.params.range);
      const filteredChartData = chartData.filter(item => item.close != undefined);
      const chartPoints = filteredChartData.map((item) => {
        return {
          xValue: item.date,
          yValue: item.close
        }
      })

      const firstChartPoint = filteredChartData[0]
      const lastChartPoint = filteredChartData[filteredChartData.length - 1]
      const percentageReturn = (lastChartPoint.close - firstChartPoint.open) / firstChartPoint.open

      res.send({
        startDate: firstChartPoint.date,
        endDate: lastChartPoint.date,
        range: req.params.range,
        percentageReturn: percentageReturn,
        dollarValue: lastChartPoint!.close,
        chart: { points: chartPoints }
      });
    } catch (error) {
      res.status(400).send(
        new APIError(
          'Bad Request',
          `Request failed for stock: ${req.params.ticker}`
        )
      );
    }
  };

  // MARK: - Get portfolio by id
  private getPrimaryStockData = async (req: any, res: any) => {
    // Find portfolios
    const stock = await StockModel.findById(req.params.id)
    if (!stock) return res.status(400).send(
      new APIError('Bad Request', `Stock not found for: ${req.params.id}`)
    );

    const quote = await this.iex_service.fetchQuotes([stock.symbol], ['quote'])
    stock.quote = quote[0]

    // Send response 
    res.send(stock);
  };

  // MARK: - Get portfolio by id
  private getStockInvestmentSummary = async (req: any, res: any) => {
    // Find portfolios
    const stock = await StockModel.findById(req.params.id)
    if (!stock) return res.status(400).send(
      new APIError('Bad Request', `Stock not found for: ${req.params.id}`)
    );

    const quote = await this.iex_service.fetchQuotes([stock.symbol], ['quote'])
    stock.quote = quote[0]

    // Send response 
    res.send(stock);
  };

}

export default StocksController;