import mongoose from 'mongoose';
import IWatchlist from '../interfaces/watchlist.interface';
import { UserType } from './user.model';

const watchlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 50
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tickers: [
    {
      type: String,
      required: true
    }
  ],
  positions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserPosition'
  }]
}, {
    timestamps: true
  });

type WatchlistType = IWatchlist & mongoose.Document;
const WatchlistModel = mongoose.model<WatchlistType>('Watchlist', watchlistSchema)

const findWatchlistSummaries = async (user: UserType) => {
  const watchlistModels = await WatchlistModel.find({ user: user });
  const summaries = watchlistModels.map((w) => {
    return {
      id: w._id,
      name: w.name,
      tickers: w.tickers
    }
  });
  return summaries;
}

export { WatchlistModel, WatchlistType, findWatchlistSummaries };