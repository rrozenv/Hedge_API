import IStock from './stock.interface';
import IPosition from './position.interface';

export default interface IPortfolio {
    _id: string;
    name: string;
    description: string;
    rebalanceDate: Date;
    positions: string[];
    benchmarkType: string;
};