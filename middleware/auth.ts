import jwt from 'jsonwebtoken';
import config from 'config';
import APIError from '../util/Error';

export default (req: any, res: any, next: any) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(404).send(
    new APIError('Token Expired', 'Please login again.')
  );

  try {
    const decoded = jwt.verify(token, config.get('jwtKey'));
    req.user = decoded;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}