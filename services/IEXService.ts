import config from 'config';
import request from 'superagent';
import { QuoteModel } from '../models/quote.model'; 

class IEXService { 

    async fetchQuotes(tickers: string[], types: string[]) {

        if (tickers.length == 0) throw 'Tickers length is 0'

        const payload = await request
            .get(`${config.get('iex-base-url')}/stock/market/batch`)
            .query({ types: types.join(','), symbols: tickers.join(',') })
    
        return tickers.map((ticker) => { 
            const symbol = ticker.toUpperCase()
            return new QuoteModel({ 
                symbol: payload.body[symbol].quote.symbol,
                companyName: payload.body[symbol].quote.companyName,
                latestPrice: payload.body[symbol].quote.latestPrice,
                changePercent: payload.body[symbol].quote.changePercent
            })
        })
    
    }

}

export default IEXService;