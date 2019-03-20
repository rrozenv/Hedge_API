import IStock from './stock.interface';
import IUSer from './user.interface';
import IPosition from './position.interface';

export default interface IStockDetail { 
    stock: IStock; 
    watchlists: IUSer; 
    positions: IPosition[]; 
};