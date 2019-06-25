import Joi from 'joi';
import { stockWithQuoteSchema } from './stock.schema';

// Basic - Used when creating watchlist
const basicPositionSchema = Joi.object().keys({
    stock: stockWithQuoteSchema.required(),
    buyPricePerShare: Joi.number().positive().required(),
    shares: Joi.number().positive().integer().required(),
})

// Create - Used when adding a position to watchlists
const createPositionSchema = basicPositionSchema
    .concat(Joi.object().keys({
        watchlistIds: Joi.array().items(Joi.string()).required()
    }));

// Update - Used when updating position 
const updatePositionSchema = Joi.object().keys({
    buyPricePerShare: Joi.number().positive().required(),
    shares: Joi.number().positive().integer().required(),
})

export {
    basicPositionSchema,
    createPositionSchema,
    updatePositionSchema
}