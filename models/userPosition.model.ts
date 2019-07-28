import mongoose from 'mongoose';
import IUserPosition from '../interfaces/userPosition.interface';
import { stockSchema } from './stock.model';

const userPositionSchema = new mongoose.Schema({
    stock: {
        type: stockSchema,
        required: true
    },
    buyPricePerShare: {
        type: Number,
        required: true
    },
    shares: {
        type: Number,
        required: true
    },
    watchlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watchlist'
    }
}, {
        timestamps: true
    });

type UserPositionType = IUserPosition & mongoose.Document;
const UserPositionModel = mongoose.model<UserPositionType>('UserPosition', userPositionSchema)

export { UserPositionModel, UserPositionType, userPositionSchema };