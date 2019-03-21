import IStock from './stock.interface';

export default interface IPosition { 
    stock: IStock; 
    buyPricePerShare: number; 
    shares: number; 
};
