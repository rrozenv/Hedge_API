import config from 'config';
import request from 'superagent';
import { QuoteModel } from '../models/quote.model';
import IStock from '../interfaces/stock.interface';
import Joi from 'joi';
import APIError from '../util/Error';
const util = require('util');

class IEXService {

    private baseUrl: string
    private token: string

    // MARK: - Constructer
    constructor() {
        this.baseUrl = config.get('iex-base-url');
        this.token = config.get('iexKey');
    }

    fetchQuote = async (ticker: string) => {
        const url: string = `${this.baseUrl}/stock/${ticker}/quote`
        const payload = await request
            .get(url)
            .query({ token: this.token });

        const { error } = this.validateQuoteResponse(payload.body);
        if (error) throw new APIError('Bad Request', error.details[0].message);

        const { symbol, previousClose, latestPrice, changePercent } = payload.body;

        return new QuoteModel({
            symbol: symbol,
            close: previousClose,
            latestPrice: latestPrice,
            changePercent: changePercent
        });
    }

    fetchCurrentDayChart = async (ticker: string) => {
        const payload = await request
            .get(`${this.baseUrl}/stock/${ticker}/intraday-prices`)
            .query({ token: this.token });

        return payload.body
    }

    fetchHistoricalChart = async (ticker: string, range: string) => {
        const payload = await request
            .get(`${this.baseUrl}/stock/${ticker}/chart/${this.formatRange(range)}`)
            .query({ token: this.token });

        return payload.body
    }

    formatRange = (range: string): string => {
        switch (range) {
            case 'day':
                return '1d';
            case 'month':
                return '1m';
            case 'threeMonths':
                return '3m';
            case 'sixMonths':
                return '6m';
            case 'year':
                return '1y';
            case 'twoYears':
                return '2y'
            case 'fiveYears':
                return '5y'
            case 'all':
                return 'max'
            default:
                return range
        }
    }

    fetchQuotes = async (tickers: string[], types: string[]) => {
        if (tickers.length == 0) throw 'Tickers length is 0';

        try {
            const payload = await request
                .get(`${config.get('iex-base-url')}/stock/market/batch`)
                .query({ types: types.join(','), symbols: tickers.join(',') });

            return tickers.map((ticker) => {
                const symbol = ticker.toUpperCase();
                const quote = payload.body[symbol].quote;
                return new QuoteModel({
                    symbol: symbol,
                    close: quote.close,
                    latestPrice: quote.latestPrice,
                    changePercent: quote.changePercent
                });
            });
        } catch (err) {
            console.log(`QUOTES ERROR ${err}`);
            throw `Failed to fetch data for ${tickers.join(',')}`
        }
    }

    // MARK: - Fetchs quotes for all given stocks 
    fetchQuotesForStocks = async (stocks: IStock[]): Promise<IStock[]> => {
        try {
            // Fetch quotes for all stocks in portfolio
            const quotes = await this.fetchQuotes(stocks.map(s => s.symbol), ['quote']);

            // Update stocks with the fetched quotes
            return stocks.map((stock, _) => {
                const quote = quotes.filter(quote => quote.symbol == stock.symbol).pop()
                if (quote !== undefined) stock.quote = quote
                return stock
            });
        } catch (err) {
            throw `Failed to fetch data for ${stocks}`
        }
    };

    private validateQuoteResponse = (quote: any) => {
        const schema = Joi.object().keys({
            symbol: Joi.string().required(),
            previousClose: Joi.number().required(),
            latestPrice: Joi.number().required(),
            changePercent: Joi.number().required()
        }).pattern(/./, Joi.any());

        return Joi.validate(quote, schema);
    }

}

export default IEXService;