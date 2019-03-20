import { StockModel, StockType } from '../models/stock.model';

const stockTemplates: StockType[] = [ 
    new StockModel({ 
      imageUrl: '',
      sector: 'technology',
      quote: { 
        symbol: "AAPL",
        companyName: "Apple Inc",
        latestPrice: 100.0,
        changePercent: 2.0
     }
    }), 
    new StockModel({ 
      imageUrl: '',
      sector: 'technology',
      quote: { 
        symbol: "FB",
        companyName: "Facebook",
        latestPrice: 100.0,
        changePercent: 2.0
     }
    }),
    new StockModel({ 
      imageUrl: '',
      sector: 'technology',
      quote: { 
        symbol: "TSLA",
        companyName: "Tesla Inc",
        latestPrice: 100.0,
        changePercent: 2.0
     }
    })
];

export default stockTemplates;