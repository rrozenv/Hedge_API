import mongoose from 'mongoose';
import IPosition from '../interfaces/position.interface';
import { stockSchema } from './stock.model';
import { investmentSummaryGroupSchema } from './investmentSummaryGroup.model';
import { hedgeFundPositionSchema } from './hedgeFundPosition.model';

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
  type: { 
    type: String,
    required: true
  },
  status: { 
    type: String,
    required: true
  },
  weightPercentage: { 
    type: Number,
    required: false
  },
  investmentSummaryGroups: [investmentSummaryGroupSchema],
  hedgeFundPositions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HedgeFundPosition'
  }]
}, {
  timestamps: true
});

type PositionType = IPosition & mongoose.Document;
const PositionModel = mongoose.model<PositionType>('Position', positionSchema)

export { PositionModel, PositionType, positionSchema };