const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Se requiere autorización' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Se requiere autorización' });
  }

  req.user = payload;

  next();
};