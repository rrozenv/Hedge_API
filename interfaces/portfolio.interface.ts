import IStock from './stock.interface';
import IPosition from './position.interface';

export default interface IPortfolio {
    name: string;
    description: string;
    rebalanceDate: Date;
    positions: string[];
    benchmarkType: string;
};