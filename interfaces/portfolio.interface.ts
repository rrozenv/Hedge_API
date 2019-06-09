import IStock from './stock.interface';
import IPosition from './position.interface';

export default interface IPortfolio { 
    name: string; 
    description: string; 
    positions: IPosition[]; 
};