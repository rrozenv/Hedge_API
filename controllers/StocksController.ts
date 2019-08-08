// Dependencies
import express from 'express';
import Joi from 'joi';
import moment from 'moment';
import _ from 'lodash';
// Middleware
import auth from '../middleware/auth';
import validateObjectId from '../middleware/validateObjectId';
// Interfaces
import IController from '../interfaces/controller.interface';
// Models
import { PortfolioModel, PortfolioType } from '../models/portfolio.model';
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
    this.router.get(`${Path.stocks}/news`, this.getStockNewsDashboard);
    this.router.get(`${Path.stocks}/:ticker`, [auth], this.getStockQuote);
    this.router.get(`${Path.stocks}/:ticker/performance/today`, [auth], this.getCurrentDayStockChart);
    this.router.get(`${Path.stocks}/:ticker/performance/:range`, [auth], this.getHistoricalStockChart);
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

  private getStockNewsDashboard = async (req: any, res: any) => {
    const portfolios = await PortfolioModel
      .find()
      .populate('positions');

    const tickers = portfolios.map((p: any) => {
      return p.positions.map((pos: any) => {
        return pos.stock.symbol
      });
    });

    const uniqueTickers = [...new Set(_.flatten(tickers))];

    try {
      const articles = await this.iex_service.fetchNews(uniqueTickers);
      const sorted = _.compact(articles).sort((a, b) => b.date - a.date);

      res.send({
        articles: sorted.splice(0, 50) // _.sampleSize(sorted, 50)
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(
        new APIError(
          'Bad Request',
          `Failed to fetch news dashboard`
        )
      );
    }
  };

  private getCurrentDayStockChart = async (req: any, res: any) => {

    let [quote, chart] = await Promise.all([
      this.iex_service.fetchQuote(req.params.ticker),
      this.iex_service.fetchCurrentDayChart(req.params.ticker)
    ])

    const chartData: any[] = chart
    let chartPoints = chartData.reduce((result, item) => {
      const { error } = this.validateCurrentDayChartResponse(item);
      if (error == undefined) {
        result.push({
          xValue: item.label,
          yValue: item.close,
          date: item.date
        });
      }
      return result;
    }, []);

    const firstChartPoint = chartPoints[0]
    chartPoints.splice(0, 0, {
      xValue: "9:30 AM",
      yValue: quote.close,
      date: firstChartPoint.date
    });

    const lastChartPoint = chartPoints[chartPoints.length - 1]
    const percentageReturn = (lastChartPoint.yValue - quote.close) / quote.close
    const priceChange = lastChartPoint.yValue - quote.close

    const marketClose = "4:00 PM"
    const currentTime = moment(lastChartPoint.xValue, "hh:mm A");
    const closeTime = moment(marketClose, "hh:mm A");

    var diff = moment.duration(moment(closeTime).diff(moment(currentTime)));
    const minutesUntilClose = diff.asMinutes() / 5;

    for (var i = 0; i < minutesUntilClose; i++) {
      chartPoints.push({
        xValue: currentTime.add(5, 'm').format('hh:mm A').toString(),
        yValue: 0,
        date: lastChartPoint.date
      });
    }

    res.send({
      startDate: firstChartPoint.date,
      endDate: lastChartPoint.date,
      range: 'day',
      percentageReturn: percentageReturn,
      dollarValue: priceChange,
      chart: { points: chartPoints }
    });
  }

  private validateCurrentDayChartResponse = (res: any) => {
    const schema = Joi.object().keys({
      label: Joi.string().required(),
      close: Joi.number().required(),
      date: Joi.string().required()
    }).pattern(/./, Joi.any());

    return Joi.validate(res, schema);
  }

  private getHistoricalStockChart = async (req: any, res: any) => {
    const range = req.params.range;
    const chartData: any[] = await this.iex_service.fetchHistoricalChart(
      req.params.ticker,
      range
    );

    const chartPoints = chartData.reduce((result, item) => {
      const { error } = this.validateHistoricalChartResponse(item);
      if (error == undefined) {
        result.push({
          xValue: item.date,
          yValue: item.close,
          changeOverTime: item.changeOverTime
        });
      }
      return result;
    }, []);

    const firstChartPoint = chartPoints[0]
    const lastChartPoint = chartPoints[chartPoints.length - 1]
    const percentageReturn = (lastChartPoint.yValue - firstChartPoint.yValue) / firstChartPoint.yValue
    const priceChange = lastChartPoint.yValue - firstChartPoint.yValue

    res.send({
      startDate: firstChartPoint.xValue,
      endDate: lastChartPoint.xValue,
      range: range,
      percentageReturn: percentageReturn,
      dollarValue: priceChange,
      chart: { points: chartPoints }
    });
  };

  private validateHistoricalChartResponse = (res: any) => {
    const schema = Joi.object().keys({
      changeOverTime: Joi.number().required(),
      close: Joi.number().required(),
      date: Joi.string().required()
    }).pattern(/./, Joi.any());

    return Joi.validate(res, schema);
  }

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