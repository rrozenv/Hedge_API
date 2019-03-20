"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = __importDefault(require("config"));
var debug_1 = __importDefault(require("debug"));
var error_1 = __importDefault(require("../middleware/error"));
var portfolio_model_1 = require("../models/portfolio.model");
var stock_model_1 = require("../models/stock.model");
var user_model_1 = require("../models/user.model");
var quote_model_1 = require("../models/quote.model");
var stock_templates_1 = __importDefault(require("../templates/stock.templates"));
var portfolio_templates_1 = __importDefault(require("../templates/portfolio.templates"));
require('express-async-errors');
var AppController = /** @class */ (function () {
    function AppController(controllers) {
        this.app = express_1.default();
        this.log = debug_1.default('controller:app');
        this.env = this.app.get('env');
        this.connectToTheDatabase();
        this.initializeExpressMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorMiddleware();
        this.logEnvironment();
        // this.seedDatabase();
        // this.clearDatabase();
    }
    // MARK: - Public methods
    AppController.prototype.listen = function () {
        var _this = this;
        var port = process.env.PORT || 3000;
        this.app.listen(port, function () { return _this.log("Listening on port " + port + "..."); });
    };
    // MARK: - Initalize express middleware
    AppController.prototype.initializeExpressMiddleware = function () {
        this.app.use(express_1.default.json({}));
    };
    // MARK: - Initalize express middleware
    AppController.prototype.initializeErrorMiddleware = function () {
        this.app.use(error_1.default);
    };
    // MARK: - Initalize controllers
    AppController.prototype.initializeControllers = function (controllers) {
        var _this = this;
        controllers.forEach(function (controller) {
            _this.app.use('/api', controller.router);
        });
    };
    // MARK: - Connect to data base
    AppController.prototype.connectToTheDatabase = function () {
        var _this = this;
        mongoose_1.default.connect(config_1.default.get('db-host'), { useNewUrlParser: true })
            .then(function () { return _this.log('Connected to MongoDB...'); })
            .catch(function (err) { return _this.log('Could not connect to MongoDB...'); });
    };
    // MARK: - Logs current environment
    AppController.prototype.logEnvironment = function () {
        switch (this.env) {
            case 'development':
                this.log('Running Dev...');
                break;
            case 'staging':
                this.log('Running Staging...');
                break;
            case 'production':
                this.log('Running Production...');
                break;
            default:
                this.log('NODE_ENV not set!');
                break;
        }
        ;
    };
    // MARK: - Clears data base if not in production 
    AppController.prototype.clearDatabase = function () {
        if (this.env !== 'production') {
            portfolio_model_1.PortfolioModel.collection.deleteMany({});
            stock_model_1.StockModel.collection.deleteMany({});
            user_model_1.UserModel.collection.deleteMany({});
            quote_model_1.QuoteModel.collection.deleteMany({});
        }
    };
    // MARK: - Seeds data base with default models
    AppController.prototype.seedDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stock_model_1.StockModel.collection.insertMany(stock_templates_1.default)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, portfolio_model_1.PortfolioModel.collection.insertMany(portfolio_templates_1.default)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AppController;
}());
exports.default = AppController;
