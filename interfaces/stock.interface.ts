import IQuote from './quote.interface'

export default interface IStock {
    symbol: string,
    companyName: string
    imageUrl?: string;
    sector: string;
    quote?: IQuote;
};
