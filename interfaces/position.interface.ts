import IStock from './stock.interface';

export default interface IPosition { 
    stock: string; 
    buyPricePerShare: number; 
    shares: number; 
};
