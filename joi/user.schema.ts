import Joi from 'joi';
import { basicStockSchema } from './stock.schema';

export default Joi.object().keys({
    name: Joi.string().min(1).max(100).required(),
    phone: Joi.string().required(),
    admin: Joi.boolean()
});