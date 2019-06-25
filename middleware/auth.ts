import jwt from 'jsonwebtoken';
import config from 'config';

export default (req: any, res: any, next: any) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, config.get('jwtKey'));
    req.user = decoded;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
}