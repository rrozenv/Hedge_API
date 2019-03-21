import mongoose from 'mongoose';
import IStock from '../interfaces/stock.interface';
import { quoteSchema } from './quote.model';

const stockSchema = new mongoose.Schema({
  symbol: { 
    type: String,
    required: true,
    minlength: 0,
    maxlength: 10
  },
  imageUrl: { 
    type: String,
    required: false,
    minlength: 0,
    maxlength: 10000
  },
  sector: { 
    type: String,
    required: true,
    enum: ['technology', 'energy', 'healthcare'],
    maxlength: 10000
  },
  quote: { 
    type: quoteSchema,
    required: true
  }
});

type StockType = IStock & mongoose.Document;
const StockModel = mongoose.model<StockType>('Stock', stockSchema)

export { stockSchema, StockModel, StockType };