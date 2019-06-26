"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hedgeFund_model_1 = require("../models/hedgeFund.model");
const hedgeFundTemplates = [
    new hedgeFund_model_1.HedgeFundModel({
        name: "Hedge Fund 1",
        manager: "Manager Fund 1"
    }),
    new hedgeFund_model_1.HedgeFundModel({
        name: "Hedge Fund 2",
        manager: "Manager Fund 2"
    }),
    new hedgeFund_model_1.HedgeFundModel({
        name: "Hedge Fund 3",
        manager: "Manager Fund 3"
    }),
];
exports.default = hedgeFundTemplates;
