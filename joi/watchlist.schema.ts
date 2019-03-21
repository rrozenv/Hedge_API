import Joi from 'joi';
import { basicPositionSchema } from './position.schema';

export default Joi.object().keys({ 
    name: Joi.string().min(1).required(),
    positions: Joi.array().items(basicPositionSchema)
})
