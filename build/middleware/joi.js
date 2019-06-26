"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const joi_1 = __importDefault(require("joi"));
const position_schema_1 = require("../joi/position.schema");
const watchlist_schema_1 = __importDefault(require("../joi/watchlist.schema"));
const portfolio_schema_1 = __importDefault(require("../joi/portfolio.schema"));
const hedgeFund_schema_1 = require("../joi/hedgeFund.schema");
const Path_1 = __importDefault(require("../util/Path"));
const Error_1 = __importDefault(require("../util/Error"));
exports.default = async (req, res, next) => {
    // Enabled HTTP methods for request data validation
    const supportedMethods = ['post', 'put'];
    // Object with keys as route paths and schema required for those routes
    const schemas = {
        [Path_1.default.portfolios]: portfolio_schema_1.default,
        [Path_1.default.createPositions]: position_schema_1.createPositionSchema,
        [Path_1.default.updatePositions]: position_schema_1.updatePositionSchema,
        [Path_1.default.watchlists]: watchlist_schema_1.default,
        [Path_1.default.hedgeFunds]: hedgeFund_schema_1.createHedgeFundSchema,
        [`${Path_1.default.hedgeFunds}/:id/positions`]: hedgeFund_schema_1.addPositionsSchema
    };
    // Joi validation options
    const validationOptions = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true // remove unknown keys from the validated data
    };
    const route = req.route.path;
    const method = req.method.toLowerCase();
    const schema = lodash_1.default.get(schemas, route);
    // If there is no schema for route or is not a supported method just return 
    if (!schema || !lodash_1.default.includes(supportedMethods, method))
        return next();
    // Validate schema
    try {
        const data = await validate(req.body, schema, validationOptions);
        req.body = data;
        next();
    }
    catch (err) {
        const message = lodash_1.default.reduce(err.details, (acc, detail) => `${detail.message}, ${acc}`, '');
        res.status(400).json(new Error_1.default('Bad Request', message));
    }
};
// Wraps Joi validation function as promise
function validate(value, schema, options) {
    return new Promise((resolve, reject) => {
        joi_1.default.validate(value, schema, options, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
