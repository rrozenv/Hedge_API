"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const investmentSummaryGroup_model_1 = require("../models/investmentSummaryGroup.model");
const investmentSummaryGroupTemplates = [
    new investmentSummaryGroup_model_1.InvestmentSummaryGroupModel({
        title: "Group 1 Title",
        body: "Group 1 Body"
    }),
    new investmentSummaryGroup_model_1.InvestmentSummaryGroupModel({
        title: "Group 2 Title",
        body: "Group 2 Body"
    }),
    new investmentSummaryGroup_model_1.InvestmentSummaryGroupModel({
        title: "Group 3 Title",
        body: "Group 3 Body"
    })
];
exports.default = investmentSummaryGroupTemplates;
