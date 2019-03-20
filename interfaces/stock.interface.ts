import IQuote from './quote.interface'

export default interface IStock { 
    imageUrl: string; 
    sector: string;
    quote: IQuote;
};
  