import IStock from './stock.interface';

export default interface IUserPosition {
    stock: IStock;
    buyPricePerShare: number;
    shares: number;
    watchlistId: string;
};
