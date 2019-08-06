// Dependencies
import express from 'express';
import Joi from 'joi';
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
import { BenchmarkPerformanceModel } from '../models/benchmarkPerformance.model';
// Interfaces
import IController from '../interfaces/controller.interface';
import IStock from '../interfaces/stock.interface';
import IPortfolio from '../interfaces/portfolio.interface';
import IPerformance from '../interfaces/performance.interface';
// Services
import IEXService from '../services/IEXService';
import APIError from '../util/Error';
// Path
import Path from '../util/Path';

// MARK: - PortfoliosController
class PortfolioPerformanceController implements IController {

    // MARK: - Properties
    public router = express.Router({});
    private iex_service: IEXService;
    private log: debug.Debugger;

    // MARK: - Constructor
    constructor() {
        this.iex_service = new IEXService();
        this.log = debug('controller:portfolioPerformance');
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // [auth, validateObjectId] 
        // GET 
        this.router.get(`${Path.portfolios}/:id/chart`, this.getPerformance);

        // POST
        this.router.post(`${Path.portfolios}/:id/chart`, this.createPerformance);
        this.router.post(`${Path.benchmarks}/:type/chart`, this.createBenchmarkPerformance);
    }

    /// ** ---- GET ROUTES ---- **

    // MARK: - Get performance for range
    private getPerformance = async (req: any, res: any) => {
        // Find portfolio
        const portfolio = await PortfolioModel.findById(req.params.id);
        if (!portfolio) return res.status(400).send(
            new APIError('Bad Request', `Portfolio not found for: ${req.params.id}`)
        );

        // Create performance response 
        const range: string = req.query.range;
        const performanceResponse = await createChartPerformanceResponse(portfolio, range);

        // Send response
        res.send(performanceResponse);
    }

    /// ** ---- POST ROUTES ---- **

    // MARK: - Get performance for range
    private createPerformance = async (req: any, res: any) => {
        // Find portfolio by id.
        const portfolio = await PortfolioModel.findById(req.params.id);
        if (!portfolio) return res.status(400).send(
            new APIError('Bad Request', `Portfolio not found for: ${req.params.id}`)
        );

        // Create performance models.
        await createChartPerformanceModels(
            portfolio,
            req.body.chartPoints
        );

        const performanceResponse = await createChartPerformanceResponse(
            portfolio,
            'all'
        );

        // Send response. 
        res.send(performanceResponse);
    }

    // MARK: - Create benchmark performance for type. 
    private createBenchmarkPerformance = async (req: any, res: any) => {
        await BenchmarkPerformanceModel.deleteMany({ type: req.params.type });

        await createBenchmarkPerformanceModels(
            req.params.type,
            req.body.chartPoints
        );

        const benchmarkPerformance = await createBenchmarkPerformanceResponse(
            req.params.type,
            moment().toDate()
        );

        // Send response. 
        res.send(benchmarkPerformance);
    }

}

const createChartPerformanceModels = async (portfolio: IPortfolio, points: IPerformance[]) => {
    // Create performance points.
    const performanceModels = await Promise.all(
        points.map(async point => {
            const model = new DailyPortfolioPerformanceModel({
                portfolio: portfolio._id,
                date: point.date,
                performance: point.performance
            });
            await model.save();
            return model;
        })
    );

    return performanceModels
}

const createBenchmarkPerformanceModels = async (type: string, points: IPerformance[]) => {
    // Create benchmark chart points.
    const performanceModels = await Promise.all(
        points.map(async point => {
            const model = new BenchmarkPerformanceModel({
                type: type,
                date: point.date,
                performance: point.performance
            });
            await model.save();
            return model;
        })
    );

    return performanceModels;
}

const createChartPerformanceResponse = async (portfolio: PortfolioType, range: string) => {
    const startDate = findStartDate(range);
    const endDate = moment().toDate();

    const query = {
        portfolio: portfolio,
        date: {
            $lte: endDate,
            ...startDate && { $gte: startDate }
        }
    };

    const chartPointModels = await DailyPortfolioPerformanceModel
        .find(query)
        .sort('date');

    const chartPoints = createChartPoints(chartPointModels);
    const percentageReturn = calculatePercentageReturn(chartPointModels);
    const benchmarkPerformance = await createBenchmarkPerformanceResponse(portfolio.benchmarkType, endDate, startDate);

    return {
        startDate: moment(chartPointModels[0].date).startOf('month').toDate(),
        endDate: chartPointModels[chartPointModels.length - 1].date,
        range: range,
        percentageReturn: percentageReturn,
        chart: { points: chartPoints },
        benchmark: benchmarkPerformance
    }
}

const findStartDate = (range: string): Date | undefined => {
    switch (range) {
        case 'month':
            return moment().subtract(2, 'months').endOf('month').toDate();
        case 'threeMonths':
            return moment().subtract(4, 'months').endOf('month').toDate();
        case 'sixMonths':
            return moment().subtract(7, 'months').endOf('month').toDate();
        case 'year':
            return moment().subtract(13, 'months').endOf('month').toDate();
        default:
            return undefined;
    }
}

const createBenchmarkPerformanceResponse = async (type: string, endDate: Date, startDate?: Date) => {
    const query = {
        type: type,
        date: {
            $lte: endDate,
            ...startDate && { $gte: startDate }
        }
    };

    const benchmarkModels = await BenchmarkPerformanceModel
        .find(query)
        .sort('date');

    const percentageReturn = calculatePercentageReturn(benchmarkModels);
    const chartPoints = createChartPoints(benchmarkModels);

    return {
        type: type,
        percentageReturn: percentageReturn,
        chart: { points: chartPoints }
    }
}

const createChartPoints = (returnValues: IPerformance[]): any => {
    // let sum = 1000
    const points = returnValues.map((val) => {
        // sum = sum * (1 + val.performance)
        return {
            xValue: val.date.toJSON(),
            yValue: val.performance // sum - 1000
        }
    });

    const firstPoint = [{
        xValue: moment().toJSON(),
        yValue: 1000
    }]

    return firstPoint.concat(points);
}

const calculatePercentageReturn = (returnValues: IPerformance[]): number => {
    if (returnValues.length < 1) return 0
    if (returnValues.length == 1) return returnValues[0].performance

    const lastValue = returnValues[returnValues.length - 1].performance
    const firstValue = returnValues[0].performance

    return (lastValue - firstValue) / firstValue
    // const endingValue = returnValues.reduce((sum, val) => {
    //     return sum * (1000 + val.performance)
    // }, 1);
    // return endingValue - 1000
}

export { PortfolioPerformanceController, createChartPerformanceResponse, createChartPerformanceModels }