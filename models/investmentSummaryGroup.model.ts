import mongoose from 'mongoose';
import IInvestmentSummaryGroup from '../interfaces/investmentSummaryGroup.interface';

const investmentSummaryGroupSchema = new mongoose.Schema({
  title: {  
    type: String,  
    required: true
  },
  body: { 
    type: String,
    required: true
  }
});

type InvestmentSummaryGroupType = IInvestmentSummaryGroup & mongoose.Document;
const InvestmentSummaryGroupModel = mongoose.model<InvestmentSummaryGroupType>('InvestmentSummaryGroup', investmentSummaryGroupSchema)

export { InvestmentSummaryGroupModel, InvestmentSummaryGroupType, investmentSummaryGroupSchema };