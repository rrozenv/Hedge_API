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
var stock_model_1 = require("../models/stock.model");
var watchlist_model_1 = require("../models/watchlist.model");
var IEXService_1 = __importDefault(require("../services/IEXService"));
var StocksController = /** @class */ (function () {
    // MARK: - Constructor
    function StocksController() {
        var _this = this;
        this.path = '/stocks';
        this.router = express_1.default.Router({});
        // MARK: - GET API's
        this.getStocks = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var stocks, quotes, updatedStocks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stock_model_1.StockModel.find()];
                    case 1:
                        stocks = _a.sent();
                        return [4 /*yield*/, this.iex_service.fetchQuotes(stocks.map(function (s) { return s.quote.symbol; }), ['quote'])];
                    case 2:
                        quotes = _a.sent();
                        updatedStocks = stocks.map(function (stock, _) {
                            var quote = quotes.filter(function (quote) { return quote.symbol == stock.quote.symbol; }).pop();
                            if (quote !== undefined)
                                stock.quote = quote;
                            return stock;
                        });
                        res.send(updatedStocks);
                        return [2 /*return*/];
                }
            });
        }); };
        // MARK: - Get portfolio by id
        this.getStock = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var stock, watchlists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stock_model_1.StockModel.findById(req.params.id)];
                    case 1:
                        stock = _a.sent();
                        if (!stock) return [3 /*break*/, 3];
                        return [4 /*yield*/, watchlist_model_1.WatchlistModel
                                .find({ user: req.user._id })];
                    case 2:
                        watchlists = _a.sent();
                        res.send({
                            stock: stock,
                            watchlists: watchlists
                        });
                        _a.label = 3;
                    case 3:
                        res.status(400).send("Stock not found for: " + req.params.id);
                        return [2 /*return*/];
                }
            });
        }); };
        // MARK: - POST API's
        this.createStock = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, symbol, companyName, stock;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, symbol = _a.symbol, companyName = _a.companyName;
                        stock = new stock_model_1.StockModel({
                            symbol: symbol,
                            companyName: companyName,
                            imageUrl: '',
                            sector: 'technology',
                            quote: {
                                symbol: symbol,
                                companyName: companyName,
                                latestPrice: 100.0,
                                changePercent: 2.0
                            }
                        });
                        return [4 /*yield*/, stock.save()];
                    case 1:
                        _b.sent();
                        res.send(stock);
                        return [2 /*return*/];
                }
            });
        }); };
        this.iex_service = new IEXService_1.default();
        this.initializeRoutes();
    }
    StocksController.prototype.initializeRoutes = function () {
        this.router.get(this.path, this.getStocks);
        this.router.post(this.path + "/:id", this.getStock);
        this.router.post(this.path, this.createStock);
    };
    return StocksController;
}());
exports.default = StocksController;
