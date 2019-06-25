import { PositionModel, PositionType } from '../models/position.model';
import stockTemplates from './stock.templates';
import investmentSummaryGroupTemplates from './investmentSummaryGroup.templates';
import hedgeFundPositionTemplates from './hedgeFundPosition.templates';

const positionTemplates: PositionType[] = [
    new PositionModel({
        stock: stockTemplates[0],
        buyPricePerShare: 100.0,
        shares: 1,
        type: 'buy',
        status: 'new',
        weightPercentage: 0.5,
        investmentSummaryGroups: investmentSummaryGroupTemplates,
        hedgeFundPositions: hedgeFundPositionTemplates
    }),
    new PositionModel({
        stock: stockTemplates[1],
        buyPricePerShare: 100.0,
        shares: 1,
        type: 'buy',
        status: 'new',
        weightPercentage: 0.5,
        investmentSummaryGroups: investmentSummaryGroupTemplates,
        hedgeFundPositions: hedgeFundPositionTemplates
    }),
    new PositionModel({
        stock: stockTemplates[2],
        buyPricePerShare: 100.0,
        shares: 1,
        type: 'buy',
        status: 'new',
        weightPercentage: 0.5,
        investmentSummaryGroups: investmentSummaryGroupTemplates,
        hedgeFundPositions: hedgeFundPositionTemplates
    })
];

export default positionTemplates;

