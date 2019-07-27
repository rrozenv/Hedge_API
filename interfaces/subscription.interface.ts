
interface IOffering {
    key: string;
    productId: string;
    status: string;
    price: number;
}

interface IEntitlement {
    key: string;
    offerings: IOffering[];
}

interface ISubscription {
    entitlement: IEntitlement,
    trialExpiration: Date;
};

export { IOffering, IEntitlement, ISubscription }
