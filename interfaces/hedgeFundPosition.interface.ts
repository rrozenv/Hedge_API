export default interface IHedgeFundPosition { 
    hedgeFund: { 
        name: string,
        manager: string
    };
    symbol: string;
    marketValue: number;
    purchaseDate: Date;
};
