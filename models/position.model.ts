import mongoose from 'mongoose';
import IPosition from '../interfaces/position.interface';
import { stockSchema } from './stock.model';

const positionSchema = new mongoose.Schema({
  stock: {  
    type: stockSchema,  
    required: true
  },
  buyPricePerShare: { 
    type: Number,
    required: true
  },
  shares: { 
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

type PositionType = IPosition & mongoose.Document;
const PositionModel = mongoose.model<PositionType>('Position', positionSchema)

export { PositionModel, PositionType, positionSchema };