const helmet = require('helmet');
const compression = require('compression');

export default (app: any) => {
    console.log('PROD SETUP!');
    app.use(helmet());
    app.use(compression());
};