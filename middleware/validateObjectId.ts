import mongoose from 'mongoose';

export default (req: any, res: any, next: any) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid ID.');

  next();
}