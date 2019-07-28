import Joi from 'joi';
import quoteSchema from './quote.schema';

const basicStockSchema = Joi.object().keys({
    symbol: Joi.string().required(),
    companyName: Joi.string().required(),
    sector: Joi.string().required()
    // imageUrl: Joi.string().optional(),
    // Joi.string().valid('technology', 'energy', 'biotech').required(),
});

const stockWithQuoteSchema = basicStockSchema
    .concat(Joi.object().keys({ quote: quoteSchema.required() }));

export {
    basicStockSchema,
    stockWithQuoteSchema
}
