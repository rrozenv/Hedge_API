import IStock from './stock.interface';

export default interface IPortfolio { 
    name: string; 
    description: string; 
    stocks: IStock[]; 
};