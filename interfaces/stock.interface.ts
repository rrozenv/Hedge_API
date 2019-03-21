import IQuote from './quote.interface'

export default interface IStock { 
    symbol: string,
    imageUrl: string; 
    sector: string;
    quote: IQuote;
};
  