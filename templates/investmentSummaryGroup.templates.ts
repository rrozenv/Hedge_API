import { InvestmentSummaryGroupModel, InvestmentSummaryGroupType } from '../models/investmentSummaryGroup.model';

const investmentSummaryGroupTemplates: InvestmentSummaryGroupType[] = [
    new InvestmentSummaryGroupModel({
        title: "Group 1 Title",
        body: "Group 1 Body"
    }),
    new InvestmentSummaryGroupModel({
        title: "Group 2 Title",
        body: "Group 2 Body"
    }),
    new InvestmentSummaryGroupModel({
        title: "Group 3 Title",
        body: "Group 3 Body"
    })
];

export default investmentSummaryGroupTemplates;