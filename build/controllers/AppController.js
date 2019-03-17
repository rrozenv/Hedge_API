"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = __importDefault(require("config"));
var debug_1 = __importDefault(require("debug"));
var AppController = /** @class */ (function () {
    function AppController(controllers) {
        this.app = express_1.default();
        this.log = debug_1.default('controller:app');
        this.connectToTheDatabase();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.logEnvironment();
    }
    // MARK: - Public methods
    AppController.prototype.listen = function () {
        var _this = this;
        var port = process.env.PORT || 3000;
        this.app.listen(port, function () { return _this.log("Listening on port " + port + "..."); });
    };
    // MARK: - Initalize middleware
    AppController.prototype.initializeMiddleware = function () {
        this.app.use(express_1.default.json({}));
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
    AppController.prototype.logEnvironment = function () {
        var env = this.app.get('env');
        switch (env) {
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
    return AppController;
}());
exports.default = AppController;
