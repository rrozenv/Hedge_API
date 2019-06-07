import { PortfolioModel, PortfolioType } from '../models/portfolio.model';
import stockTemplates from './stock.templates';

const portfolioTemplates: PortfolioType[] = [ 
    new PortfolioModel({ 
      name: "First Portfolio",
      description: "First Desc",
      stocks: stockTemplates,
    }),
    new PortfolioModel({ 
      name: "Second Portfolio",
      description: "Second Desc",
      stocks: stockTemplates,
    }),
    new PortfolioModel({ 
      name: "Second Portfolio",
      description: "Second Desc",
      stocks: stockTemplates,
    })
];

export default portfolioTemplates;