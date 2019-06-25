import { DailyPortfolioPerformanceModel, DailyPortfolioPerformanceType } from '../models/dailyPortfolioPerformance.model';
import { PortfolioType } from '../models/portfolio.model';
import moment from 'moment';

const dailyPortfolioPerformanceTemplates = (portfolio: PortfolioType): DailyPortfolioPerformanceType[] => {
    return [
        new DailyPortfolioPerformanceModel({
            portfolio: portfolio._id,
            date: moment().subtract(1, 'months').endOf('month').toDate(),
            performance: 10.0
        }),
        new DailyPortfolioPerformanceModel({
            portfolio: portfolio._id,
            date: moment().subtract(2, 'months').endOf('month').toDate(),
            performance: 20.0
        }),
        new DailyPortfolioPerformanceModel({
            portfolio: portfolio._id,
            date: moment().subtract(3, 'months').endOf('month').toDate(),
            performance: 30.0
        }),
        new DailyPortfolioPerformanceModel({
            portfolio: portfolio._id,
            date: moment().subtract(10, 'months').endOf('month').toDate(),
            performance: 100.0
        })
    ];
}

export default dailyPortfolioPerformanceTemplates;