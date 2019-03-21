import Joi from 'joi';

export default Joi.object().keys({ 
    symbol: Joi.string().min(1).max(5).required(),
    companyName: Joi.string().min(1), 
    latestPrice: Joi.number().positive().required(),
    changePercent: Joi.number().required(),
})