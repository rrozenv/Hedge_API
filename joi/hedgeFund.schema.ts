import Joi from 'joi';

const createHedgeFundSchema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    manager: Joi.string().min(1).required(),
});

const addPositionsSchema = Joi.object().keys({
    stockSymbol: Joi.string().min(1).required(),
    marketValue: Joi.number().required(),
    purchaseDate: Joi.date().required()
});

export { createHedgeFundSchema, addPositionsSchema }