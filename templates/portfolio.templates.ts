import { PortfolioModel, PortfolioType } from '../models/portfolio.model';
import positionTemplates from './position.templates';

const portfolioTemplates: PortfolioType[] = [ 
    new PortfolioModel({ 
      name: "First Portfolio",
      description: "First Desc",
      rebalanceDate: new Date(),
      positions: positionTemplates,
    }),
    new PortfolioModel({ 
      name: "Second Portfolio",
      description: "Second Desc",
      rebalanceDate: new Date(),
      positions: positionTemplates,
    }),
    new PortfolioModel({ 
      name: "Second Portfolio",
      description: "Second Desc",
      rebalanceDate: new Date(),
      positions: positionTemplates,
    })
];

export default portfolioTemplates;