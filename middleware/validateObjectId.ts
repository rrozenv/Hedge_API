import mongoose from 'mongoose';
import APIError from '../util/Error';

export default (req: any, res: any, next: any) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send(new APIError('Bad Request', `Invalid ID: ${req.params.id}`));

  next();
}