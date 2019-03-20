import mongoose from 'mongoose';
import IPortfolio from '../interfaces/portfolio.interface';

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
  stocks: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock'
  }]
}, {
  timestamps: true
});

type PortfolioType = IPortfolio & mongoose.Document;
const PortfolioModel = mongoose.model<PortfolioType>('Portfolio', portfolioSchema)

export { PortfolioModel, PortfolioType };