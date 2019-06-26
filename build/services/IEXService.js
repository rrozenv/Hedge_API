"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const superagent_1 = __importDefault(require("superagent"));
const quote_model_1 = require("../models/quote.model");
class IEXService {
    // MARK: - Constructer
    constructor() {
        this.fetchQuote = async (ticker) => {
            const url = `${this.baseUrl}/stock/${ticker}/quote`;
            const payload = await superagent_1.default
                .get(url)
                .query({ token: this.token });
            return payload.body;
        };
        this.fetchChart = async (ticker, range) => {
            const payload = await superagent_1.default
                .get(`${this.baseUrl}/stock/${ticker}/chart/${this.formatRange(range)}`)
                .query({ token: this.token });
            return payload.body;
        };
        this.formatRange = (range) => {
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
                    return '2y';
                case 'fiveYears':
                    return '5y';
                case 'all':
                    return 'max';
                default:
                    return range;
            }
        };
        this.fetchQuotes = async (tickers, types) => {
            if (tickers.length == 0)
                throw 'Tickers length is 0';
            try {
                const payload = await superagent_1.default
                    .get(`${config_1.default.get('iex-base-url')}/stock/market/batch`)
                    .query({ types: types.join(','), symbols: tickers.join(',') });
                return tickers.map((ticker) => {
                    const symbol = ticker.toUpperCase();
                    const quote = payload.body[symbol].quote;
                    return new quote_model_1.QuoteModel({
                        latestPrice: quote.latestPrice,
                        changePercent: quote.changePercent
                    });
                });
            }
            catch (err) {
                console.log(`QUOTES ERROR ${err}`);
                throw `Failed to fetch data for ${tickers.join(',')}`;
            }
        };
        // MARK: - Fetchs quotes for all given stocks 
        this.fetchQuotesForStocks = async (stocks) => {
            try {
                // Fetch quotes for all stocks in portfolio
                const quotes = await this.fetchQuotes(stocks.map(s => s.symbol), ['quote']);
                // Update stocks with the fetched quotes
                return stocks.map((stock, _) => {
                    const quote = quotes.filter(quote => quote.symbol == stock.symbol).pop();
                    if (quote !== undefined)
                        stock.quote = quote;
                    return stock;
                });
            }
            catch (err) {
                throw `Failed to fetch data for ${stocks}`;
            }
        };
        this.baseUrl = config_1.default.get('iex-base-url');
        this.token = config_1.default.get('iexKey');
    }
}
exports.default = IEXService;
