import { PositionModel, PositionType } from '../models/position.model';
import stockTemplates from './stock.templates';

const positionTemplates: PositionType[] = [ 
    new PositionModel({ 
        stock: stockTemplates[0],
        buyPricePerShare: 100.0, 
        shares: 1, 
        type: 'buy', 
        status: 'new',
        weightPercentage: 0.5
    }),
    new PositionModel({ 
        stock: stockTemplates[1],
        buyPricePerShare: 100.0, 
        shares: 1, 
        type: 'buy', 
        status: 'new',
        weightPercentage: 0.5
    }),
    new PositionModel({ 
        stock: stockTemplates[2],
        buyPricePerShare: 100.0, 
        shares: 1, 
        type: 'buy', 
        status: 'new',
        weightPercentage: 0.5
    })
];

export default positionTemplates;

