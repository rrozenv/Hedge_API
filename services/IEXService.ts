import config from 'config';
import request from 'superagent';
import { QuoteModel } from '../models/quote.model'; 
import IStock from '../interfaces/stock.interface';

class IEXService { 

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
                    latestPrice: quote.latestPrice,
                    changePercent: quote.changePercent
                });
            });
        } catch (err) {
            console.log(`QUOTES ERROR ${err}`);
            throw `Failed to fetch data for ${ tickers.join(',') }`
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
            console.log(err);
            throw `Failed to fetch data for ${ stocks }`
        }
    };

}

export default IEXService;