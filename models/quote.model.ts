import mongoose from 'mongoose';
import IQuote from '../interfaces/quote.interface';

const quoteSchema = new mongoose.Schema({
    symbol: { 
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    companyName: { 
        type: String,
        required: false,
        minlength: 0,
        maxlength: 50
    },
    latestPrice: { 
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    changePercent: { 
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 50
    },
});

type QuoteType = IQuote & mongoose.Document;
const QuoteModel = mongoose.model<QuoteType>('IEXQuote', quoteSchema)

export { quoteSchema, QuoteModel }