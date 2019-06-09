import mongoose from 'mongoose';
import IPortfolio from '../interfaces/portfolio.interface';
import { stockSchema } from './stock.model';
import { positionSchema } from './position.model';

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
  positions: [positionSchema]
}, {
  timestamps: true
});

type PortfolioType = IPortfolio & mongoose.Document;
const PortfolioModel = mongoose.model<PortfolioType>('Portfolio', portfolioSchema)

export { PortfolioModel, PortfolioType };