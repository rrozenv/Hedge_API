import config from 'config';
import request from 'superagent';
import { QuoteModel } from '../models/quote.model';
import IStock from '../interfaces/stock.interface';
import Joi from 'joi';
import APIError from '../util/Error';
import _ from 'lodash';
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

        const payload = await request
            .get(`${this.baseUrl}/stock/market/batch`)
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
    }

    fetchNews = async (tickers: string[]) => {
        if (tickers.length == 0) throw 'Tickers length is 0';

        const payload = await request
            .get(`${this.baseUrl}/stock/market/batch`)
            .query({ types: 'news', symbols: tickers.join(',') })
            .query({ token: this.token });

        const twoDArr = tickers.map((ticker) => {
            const symbol = ticker.toUpperCase();
            const info = payload.body[symbol];
            if (!info) return undefined;
            if (!info.news) return undefined;

            // const { error } = this.validateQuoteResponse(payload.body);
            // if (error) return undefined

            return info.news.map((article: any) => {
                return {
                    ticker: symbol,
                    date: new Date(article.datetime),
                    headline: article.headline,
                    source: article.source,
                    url: article.url,
                    summary: article.summary,
                    related: article.related,
                    image: article.image,
                    lang: article.lang,
                    hasPaywall: article.hasPaywall
                }
            });
        });

        return _.flatten(twoDArr)
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

    private validateArticleResponse = (article: any) => {
        const schema = Joi.object().keys({
            ticker: Joi.string().required(),
            datetime: Joi.number().required(),
            headline: Joi.string().required(),
            source: Joi.string().required(),
            url: Joi.string().required(),
            summary: Joi.string().required(),
            image: Joi.string().required()
        }).pattern(/./, Joi.any());

        return Joi.validate(article, schema);
    }

}

export default IEXService;