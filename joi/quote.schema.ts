import Joi from 'joi';

export default Joi.object().keys({
    latestPrice: Joi.number().positive().required(),
    changePercent: Joi.number().required(),
    close: Joi.number().required()
})