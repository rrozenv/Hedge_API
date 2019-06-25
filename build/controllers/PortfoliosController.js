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
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
var Joi_1 = __importDefault(require("Joi"));
var debug_1 = __importDefault(require("debug"));
var portfolio_model_1 = require("../models/portfolio.model");
var stock_model_1 = require("../models/stock.model");
var IEXService_1 = __importDefault(require("../services/IEXService"));
var auth_1 = __importDefault(require("../middleware/auth"));
var validateObjectId_1 = __importDefault(require("../middleware/validateObjectId"));
var PortfoliosController = /** @class */ (function () {
    // MARK: - Constructor
    function PortfoliosController() {
        var _this = this;
        // MARK: - Properties
        this.path = '/portfolios';
        this.router = express_1.default.Router({});
        /// ** ---- GET ROUTES ---- **
        // MARK: - Get dashboard
        this.getDashboard = function (req, res) {
            return __awaiter(_this, void 0, void 0, function () {
                var portfolios, firstPortfolio, updatedStocks, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, portfolio_model_1.PortfolioModel.find()
                            .populate({ path: 'stocks', model: 'Stock' })
                            // If first portfolio return empty array 
                        ];
                        case 1:
                            portfolios = _a.sent();
                            firstPortfolio = portfolios.shift();
                            if (!firstPortfolio)
                                return [2 /*return*/, res.send(portfolios)
                                    // Try to fetch updated stocks for first portoflio only
                                ];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, this.iex_service.fetchQuotesForStocks(firstPortfolio.stocks)];
                        case 3:
                            updatedStocks = _a.sent();
                            firstPortfolio.stocks = updatedStocks;
                            return [4 /*yield*/, firstPortfolio.save()];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            this.log(error_1);
                            return [3 /*break*/, 6];
                        case 6:
                            // Return all portfolios with first having updated stock quotes
                            res.send({ portfolios: [firstPortfolio].concat(portfolios) });
                            return [2 /*return*/];
                    }
                });
            });
        };
        // MARK: - Get portfolio by id
        this.getPortfolio = function (req, res) {
            return __awaiter(_this, void 0, void 0, function () {
                var portfolio, updatedStocks, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, portfolio_model_1.PortfolioModel.findById(req.params.id)
                            .populate({ path: 'stocks', model: 'Stock' })];
                        case 1:
                            portfolio = _a.sent();
                            if (!portfolio) return [3 /*break*/, 6];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, this.iex_service.fetchQuotesForStocks(portfolio.stocks)];
                        case 3:
                            updatedStocks = _a.sent();
                            portfolio.stocks = updatedStocks;
                            return [4 /*yield*/, portfolio.save()];
                        case 4:
                            _a.sent();
                            res.send(portfolio);
                            return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            this.log(error_2);
                            res.send(portfolio);
                            return [3 /*break*/, 6];
                        case 6:
                            // Return error if portfolio not found
                            res.status(400).send("Portfolio not found for: " + req.params.id);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /// ** ---- POST ROUTES ---- **
        // MARK: - POST API's
        this.createPortfolio = function (req, res) {
            return __awaiter(_this, void 0, void 0, function () {
                var error, name, description, stocks, newStocks, portfolio;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            error = this.validateCreate(req.body).error;
                            if (error)
                                return [2 /*return*/, res.status(400).send(error.details[0].message)];
                            name = req.body.name;
                            description = req.body.description;
                            stocks = req.body.stocks;
                            return [4 /*yield*/, Promise.all(stocks.map(function (stock) {
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.createStock(stock)];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    });
                                });
                            }))];
                        case 1:
                            newStocks = _a.sent();
                            portfolio = new portfolio_model_1.PortfolioModel({
                                name: name,
                                description: description,
                                stocks: newStocks,
                            });
                            return [4 /*yield*/, portfolio.save()];
                        case 2:
                            _a.sent();
                            // Return portfolio 
                            res.send(portfolio);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /// ** ---- HELPER METHODS ---- **
        // MARK: Create stock and save
        this.createStock = function (stock) {
            return __awaiter(_this, void 0, void 0, function () {
                var sector, quotes, stockModel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sector = stock.sector;
                            return [4 /*yield*/, this.iex_service.fetchQuotes([stock.quote.symbol], ['quote'])];
                        case 1:
                            quotes = _a.sent();
                            stockModel = new stock_model_1.StockModel({
                                imageUrl: '',
                                sector: sector,
                                quote: quotes[0]
                            });
                            return [4 /*yield*/, stockModel.save()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, stockModel];
                    }
                });
            });
        };
        /// ** ---- VALIDATION ---- **
        // MARK: - User body validation 
        this.validateCreate = function (portfolio) {
            var schema = {
                name: Joi_1.default.string().min(1).max(100).required(),
                description: Joi_1.default.string().required(),
                stocks: Joi_1.default.array()
            };
            return Joi_1.default.validate(portfolio, schema);
        };
        this.iex_service = new IEXService_1.default();
        this.log = debug_1.default('controller:portfolios');
        this.initializeRoutes();
    }
    PortfoliosController.prototype.initializeRoutes = function () {
        this.router.get(this.path, auth_1.default, this.getDashboard);
        this.router.get(this.path + "/:id", [auth_1.default, validateObjectId_1.default], this.getPortfolio);
        this.router.post(this.path, auth_1.default, this.createPortfolio);
    };
    return PortfoliosController;
}());
exports.default = PortfoliosController;
