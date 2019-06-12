import IStock from './stock.interface';
import IInvestmentSummaryGroup from './investmentSummaryGroup.interface';

export default interface IPosition { 
    stock: IStock; 
    buyPricePerShare: number; 
    shares: number; 
    type: string; // buy, sell
    status: string;  // new, hold, close 
    weightPercentage?: number;
    investmentSummaryGroups: [IInvestmentSummaryGroup];
};
