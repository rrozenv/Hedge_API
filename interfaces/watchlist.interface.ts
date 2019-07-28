import IStock from './stock.interface';
import IUSer from './user.interface';
import IUserPosition from './userPosition.interface';

export default interface IWatchlist {
    name: string;
    user: string;
    tickers: string[];
    positions: IUserPosition[];
};