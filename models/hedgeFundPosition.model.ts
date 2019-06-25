import mongoose from 'mongoose';
import IHedgeFundPosition from '../interfaces/hedgeFundPosition.interface';

const hedgeFundPositionSchema = new mongoose.Schema({
  hedgeFund: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      manager: {
        type: String,
        required: true
      }
    }),
    required: true
  },
  stockSymbol: {
    type: String,
    required: true
  },
  marketValue: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  }
});

type HedgeFundPositionType = IHedgeFundPosition & mongoose.Document;
const HedgeFundPositionModel = mongoose.model<HedgeFundPositionType>('HedgeFundPosition', hedgeFundPositionSchema)

export { HedgeFundPositionModel, HedgeFundPositionType, hedgeFundPositionSchema };