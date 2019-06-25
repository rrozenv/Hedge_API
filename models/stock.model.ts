import mongoose from 'mongoose';
import IStock from '../interfaces/stock.interface';
import { quoteSchema } from './quote.model';

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  sector: {
    type: String,
    required: true,
    enum: ['technology', 'energy', 'healthcare', 'biotech'],
    maxlength: 10000
  },
  quote: {
    type: quoteSchema,
    required: false
  }
});

type StockType = IStock & mongoose.Document;
const StockModel = mongoose.model<StockType>('Stock', stockSchema)

export { stockSchema, StockModel, StockType };