"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var config_1 = __importDefault(require("config"));
var debug_1 = __importDefault(require("debug"));
var stocks_1 = require("./routes/stocks");
var stocks_2 = __importDefault(require("./routes/stocks"));
//import { sayHelloInEnglish } from './routes/stocks';
var thirdFunc = require('./routes/stocks').thirdFunc;
//const stocks = require('./routes/stocks');
console.log(stocks_1.helloFunc());
console.log(thirdFunc());
var log = debug_1.default('startup');
var app = express_1.default();
app.use(express_1.default.json({}));
app.use('/api/stocks', stocks_2.default);
if (app.get('env') === 'development') {
    log('Debugger On...');
}
else {
    log('Debugger Off...');
}
console.log(config_1.default.get('name'));
app.get('/', function (req, res) {
    res.send('hello');
});
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log("Listening on port " + port + "..."); });
