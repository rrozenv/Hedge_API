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
      this.router.get(`${Path.portfolios}/:id/chart`, this.getPerformance);
      this.router.post(`${Path.portfolios}/:id/chart`, this.createPerformance);
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

    // MARK: - Get performance for range
    private createPerformance = async (req: any, res: any) => {
        // Find portfolio
        const portfolio = await PortfolioModel.findById(req.params.id); 
        if (!portfolio) return res.status(400).send(
            new APIError('Bad Request', `Portfolio not found for: ${req.params.id}`)
        );

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

        res.send(performanceModels);
    }

}

const createChartPerformanceResponse = async (portfolio: PortfolioType, range: string) => { 
    const startDate = findStartDate(range);
    const endDate = moment().toDate();
    const dailyReturnValues = await fetchDailyReturnValues(portfolio, endDate, startDate);
    const chartPoints = createChartPoints(dailyReturnValues);
    const percentageReturn = calculatePercentageReturn(dailyReturnValues);
    const start = moment(dailyReturnValues[0].date).startOf('month').toDate();

    return { 
        startDate: start,
        endDate: dailyReturnValues[dailyReturnValues.length - 1].date,
        range: range,
        percentageReturn: percentageReturn,
        chart: { points: chartPoints }
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

const fetchDailyReturnValues = async (portfolio: PortfolioType, endDate: Date, startDate?: Date) => { 
    const query = { 
        portfolio: portfolio, 
        date: { 
            $lte: endDate,
            ...startDate && { $gte: startDate }
        }
    };
    
    return await DailyPortfolioPerformanceModel
        .find(query)
        .sort('date');
}

const createChartPoints = (returnValues: DailyPortfolioPerformanceType[]): any => { 
    return returnValues.map((val) => { 
        return { 
            xValue: val.date.toJSON(),
            yValue: val.performance
        }
    });
}

const calculatePercentageReturn = (returnValues: DailyPortfolioPerformanceType[]): number => { 
    const endingValue = returnValues.reduce((sum, val) => { 
        return sum * (1+ val.performance)
    }, 1);
    return endingValue - 1
}

export { PortfolioPerformanceController, createChartPerformanceResponse }