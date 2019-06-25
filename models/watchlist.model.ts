import mongoose from 'mongoose';
import IWatchlist from '../interfaces/watchlist.interface';
// import { positionSchema } from './position.model';

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
  positions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position'
  }]
}, {
    timestamps: true
  });

type WatchlistType = IWatchlist & mongoose.Document;
const WatchlistModel = mongoose.model<WatchlistType>('Watchlist', watchlistSchema)

export { WatchlistModel, WatchlistType };