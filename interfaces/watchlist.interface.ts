import IStock from './stock.interface';
import IUSer from './user.interface';
import IPosition from './position.interface';

export default interface IWatchlist {
    name: string;
    user: string;
    positions: string[];
};