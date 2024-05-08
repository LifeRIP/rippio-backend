const { tokenVerify } = require('../services/tokenVerify');
const { pool } = require('../database/dbConfig');

const auth_user = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'NOT_TOKEN' });
    }

    const token = req.headers.authorization.split(' ').pop();
    const dataToken = await tokenVerify(token);

    if (!dataToken.userID) {
      return res.status(401).json({ message: 'ERROR_ID_TOKEN' });
    }

    const user = await pool.query(
      'SELECT * FROM datos_usuarios WHERE id = $1',
      [dataToken.userID]
    );

    // Agregar el usuario a la request
    req.user = user.rows[0];

    next();
  } catch (e) {
    return res.status(401).json({ message: 'NOT_SESSION' });
  }
};

module.exports = auth_user;
