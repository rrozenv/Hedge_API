import mongoose from 'mongoose';
import {
    IEntitlement,
    ISubscription,
    IOffering
} from '../interfaces/subscription.interface';

const offeringSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    productId: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    status: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true
    }
});

const entitlementSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    offerings: [{
        type: offeringSchema,
        required: true
    }]
});

const subscriptionSchema = new mongoose.Schema({
    entitlement: {
        type: entitlementSchema,
        required: true
    },
    trialExpiration: {
        type: Date,
        required: true
    }
});

type SubscriptionType = ISubscription & mongoose.Document;
const SubscriptionModel = mongoose.model<SubscriptionType>('Subscription', subscriptionSchema)

export { subscriptionSchema, SubscriptionModel, SubscriptionType }