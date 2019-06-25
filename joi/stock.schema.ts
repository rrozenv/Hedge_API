import Joi from 'joi';
import quoteSchema from './quote.schema';

const basicStockSchema = Joi.object().keys({
    symbol: Joi.string().min(1).max(5).required(),
    imageUrl: Joi.string().min(1),
    sector: Joi.string().valid('technology', 'energy').required(),
});

const stockWithQuoteSchema = basicStockSchema
    .concat(Joi.object().keys({ quote: quoteSchema.required() }));

// const stockWithQuoteSchema = Joi.object().keys({ 
//     symbol: Joi.string().min(1).max(5).required(),
//     imageUrl: Joi.string().min(1), 
//     sector: Joi.string().valid('technology', 'energy').required(),
//     quote: quoteSchema.required()
// })

export {
    basicStockSchema,
    stockWithQuoteSchema
}
