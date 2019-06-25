import { HedgeFundModel, HedgeFundType } from '../models/hedgeFund.model';

const hedgeFundTemplates: HedgeFundType[] = [
    new HedgeFundModel({
        name: "Hedge Fund 1",
        manager: "Manager Fund 1"
    }),
    new HedgeFundModel({
        name: "Hedge Fund 2",
        manager: "Manager Fund 2"
    }),
    new HedgeFundModel({
        name: "Hedge Fund 3",
        manager: "Manager Fund 3"
    }),
];

export default hedgeFundTemplates;