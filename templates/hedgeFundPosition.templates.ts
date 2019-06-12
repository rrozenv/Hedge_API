import { HedgeFundPositionModel, HedgeFundPositionType } from '../models/hedgeFundPosition.model';
import hedgeFundTemplates from './hedgeFund.templates';

const hedgeFundPositionTemplates: HedgeFundPositionType[] = [ 
    new HedgeFundPositionModel({ 
        hedgeFund: { 
            _id: hedgeFundTemplates[0]._id,
            name: hedgeFundTemplates[0].name,
            manager: hedgeFundTemplates[0].manager
        },
        stockSymbol: "AAPL",
        marketValue: 20000,
        purchaseDate: Date.now
    }),
    new HedgeFundPositionModel({ 
        hedgeFund: { 
            _id: hedgeFundTemplates[0]._id,
            name: hedgeFundTemplates[0].name,
            manager: hedgeFundTemplates[0].manager
        },
        stockSymbol: "FB",
        marketValue: 450606,
        purchaseDate: Date.now
    }),
    new HedgeFundPositionModel({ 
        hedgeFund: { 
            _id: hedgeFundTemplates[1]._id,
            name: hedgeFundTemplates[1].name,
            manager: hedgeFundTemplates[1].manager
        },
        stockSymbol: "TSLA",
        marketValue: 222939,
        purchaseDate: Date.now
    }),
];

export default hedgeFundPositionTemplates;