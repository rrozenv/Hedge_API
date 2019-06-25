import Joi from 'joi';
import { basicStockSchema } from './stock.schema';

export default Joi.object().keys({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    stocks: Joi.array().items(basicStockSchema)
});