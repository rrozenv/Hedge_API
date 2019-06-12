import mongoose from 'mongoose';
import IHedgeFund from '../interfaces/hedgeFund.interface';

const hedgeFundSchema = new mongoose.Schema({
  name: {  
    type: String,  
    required: true
  },
  manager: { 
    type: String,
    required: true
  }
});

type HedgeFundType = IHedgeFund & mongoose.Document;
const HedgeFundModel = mongoose.model<HedgeFundType>('HedgeFund', hedgeFundSchema)

export { HedgeFundModel, HedgeFundType, hedgeFundSchema };