import _ from 'lodash';
import Joi from 'joi';
import { createPositionSchema, updatePositionSchema } from '../joi/position.schema';
import watchlistSchema from '../joi/watchlist.schema';
import portfolioSchema from '../joi/portfolio.schema';
import Path from '../util/Path';
import APIError from '../util/Error';

export default async (req: any, res: any, next: any) => {

    // Enabled HTTP methods for request data validation
    const supportedMethods = ['post', 'put'];
    
    // Object with keys as route paths and schema required for those routes
    const schemas = { 
        [Path.portfolios]: portfolioSchema, 
        [Path.createPositions]: createPositionSchema, 
        [Path.updatePositions]: updatePositionSchema, 
        [Path.watchlists]: watchlistSchema, 
    }

    // Joi validation options
    const validationOptions = {
        abortEarly: false, // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true // remove unknown keys from the validated data
    };
    
    const route = req.route.path;
    const method = req.method.toLowerCase();
    const schema = _.get(schemas, route);

    console.log(`PATH: ${req.route.path}`);
 
    // If there is no schema for route or is not a supported method just return 
    if (!schema || !_.includes(supportedMethods, method)) return next();
    console.log(req.body);
    // Validate schema
    try {
        const data = await validate(req.body, schema, validationOptions);
        req.body = data;
        next();
    }
    catch (err) {
        console.log(err);
        const message = _.reduce(err.details, (acc, detail) => `${detail.message}, ${acc}`, '')
        res.status(400).json(new APIError('Bad Request', message));
    }
};

// Wraps Joi validation function as promise
function validate(value: any, schema: Joi.SchemaLike, options: Joi.ValidationOptions): Promise<any> { 
    return new Promise((resolve, reject) => { 
        Joi.validate(value, schema, options, (err, data) => { 
            if (err) reject(err);
            else resolve(data);
        });
    });
}
