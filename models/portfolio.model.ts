import mongoose from 'mongoose';
import IPortfolio from '../interfaces/portfolio.interface';
import { stockSchema } from './stock.model';
import { PositionModel, positionSchema } from './position.model';
import { HedgeFundPositionModel } from './hedgeFundPosition.model';
import { DailyPortfolioPerformanceModel } from './dailyPortfolioPerformance.model';

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 10000
  },
  rebalanceDate: {
    type: Date,
    required: true
  },
  benchmarkType: {
    type: String,
    required: true
  },
  positions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position'
  }]
}, {
    timestamps: true
  });

type PortfolioType = IPortfolio & mongoose.Document;
const PortfolioModel = mongoose.model<PortfolioType>('Portfolio', portfolioSchema)

const deleteByName = async (name: string) => {
  const existingPortfolio = await PortfolioModel.findOne({ name: name });
  if (existingPortfolio) {
    await Promise.all(
      existingPortfolio.positions.map(async id => {
        const position = await PositionModel.findById(id);
        if (position) {
          await Promise.all(
            position.hedgeFundPositions.map(async h => {
              await HedgeFundPositionModel.findByIdAndDelete(h);
            })
          );

          await position.remove();
        }
      })
    );

    await DailyPortfolioPerformanceModel.deleteMany({ portfolio: existingPortfolio._id });
    await existingPortfolio.remove();
  };
}

export { PortfolioModel, PortfolioType, deleteByName };