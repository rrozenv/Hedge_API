import { DailyPortfolioPerformanceModel, DailyPortfolioPerformanceType } from '../models/dailyPortfolioPerformance.model';
import { PortfolioType } from '../models/portfolio.model';
import moment from 'moment';

const dailyPortfolioPerformanceTemplates = (portfolio: PortfolioType): DailyPortfolioPerformanceType[] => { 
    return [ 
        new DailyPortfolioPerformanceModel({ 
          portfolio: portfolio._id,
          date: moment().toDate(),
          performance: new Number('10.0')
        }),
        new DailyPortfolioPerformanceModel({ 
            portfolio: portfolio._id,
            date: moment().toDate(),
            performance: new Number('10.0')
        }),
    ];
}

export default dailyPortfolioPerformanceTemplates;