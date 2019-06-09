import { StockModel, StockType } from '../models/stock.model';

const stockTemplates: StockType[] = [ 
    new StockModel({ 
      symbol: "AAPL",
      companyName: "Apple Inc",
      imageUrl: '',
      sector: 'technology',
      quote: { 
        latestPrice: 100.0,
        changePercent: 2.0
     }
    }), 
    new StockModel({ 
      imageUrl: '',
      sector: 'technology',
      symbol: "FB",
      companyName: "Facebook",
      quote: { 
        latestPrice: 100.0,
        changePercent: 2.0
     }
    }),
    new StockModel({ 
      symbol: "TSLA",
      companyName: "Tesla Inc",
      imageUrl: '',
      sector: 'technology',
      quote: { 
        latestPrice: 100.0,
        changePercent: 2.0
     }
    })
];

export default stockTemplates;