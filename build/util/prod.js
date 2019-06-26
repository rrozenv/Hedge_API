"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helmet = require('helmet');
const compression = require('compression');
exports.default = (app) => {
    console.log('PROD SETUP!');
    app.use(helmet());
    app.use(compression());
};
