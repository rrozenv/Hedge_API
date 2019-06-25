import mongoose from 'mongoose';
import IDailyPortfolioPerformance from '../interfaces/dailyPortfolioPerformance.interface';

const dailyPortfolioPerformanceModelSchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  performance: {
    type: Number,
    required: true
  }
});

type DailyPortfolioPerformanceType = IDailyPortfolioPerformance & mongoose.Document;
const DailyPortfolioPerformanceModel = mongoose.model<DailyPortfolioPerformanceType>('DailyPortfolioPerformance', dailyPortfolioPerformanceModelSchema)

export { DailyPortfolioPerformanceModel, DailyPortfolioPerformanceType };