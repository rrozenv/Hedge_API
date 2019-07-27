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
// Services
import IEXService from '../services/IEXService';
import APIError from '../util/Error';
// Path
import Path from '../util/Path';

interface IPerformance {
    date: Date;
    performance: number;
};

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
        // GET 
        this.router.get(`${Path.portfolios}/:id/chart`, [auth, validateObjectId], this.getPerformance);

        // POST
        this.router.post(`${Path.portfolios}/:id/chart`, [auth, validateObjectId], this.createPerformance);
        this.router.post(`${Path.benchmarks}/:type/chart`, [auth], this.createBenchmarkPerformance);
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

        // Create performance points.
        const chartPoints: any[] = req.body.chartPoints
        const performanceModels = await Promise.all(
            chartPoints.map(async point => {
                const model = new DailyPortfolioPerformanceModel({
                    portfolio: portfolio._id,
                    date: point.date,
                    performance: point.performance
                });
                await model.save();
                return model;
            })
        );

        // Send response. 
        res.send(performanceModels);
    }

    // MARK: - Create benchmark performance for type. 
    private createBenchmarkPerformance = async (req: any, res: any) => {
        // Create benchmark chart points.
        const chartPoints: any[] = req.body.chartPoints
        const performanceModels = await Promise.all(
            chartPoints.map(async point => {
                const model = new BenchmarkPerformanceModel({
                    type: req.params.type,
                    date: point.date,
                    performance: point.performance
                });
                await model.save();
                return model;
            })
        );

        // Send response. 
        res.send(performanceModels);
    }

}

const createChartPerformanceResponse = async (portfolio: PortfolioType, range: string) => {
    const startDate = findStartDate(range);
    const endDate = moment().toDate();
    console.log(`Start date: ${startDate}`);
    console.log(`End date: ${endDate}`);
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
    let sum = 1000
    return returnValues.map((val) => {
        sum = sum * (1 + val.performance)
        return {
            xValue: val.date.toJSON(),
            yValue: sum - 1000
        }
    });
}

const calculatePercentageReturn = (returnValues: IPerformance[]): number => {
    const endingValue = returnValues.reduce((sum, val) => {
        return sum * (1 + val.performance)
    }, 1);
    return endingValue - 1
}

export { PortfolioPerformanceController, createChartPerformanceResponse }