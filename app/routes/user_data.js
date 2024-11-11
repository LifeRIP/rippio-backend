const express = require('express');
const router = express.Router();
const {
  getAll,
  getAllByRol,
  getById,
  changeState
} = require('../controllers/user_data.controller');

router.get('/getAll', getAll); // /api/user_data/getAll
router.get('/getAllByRol/:tipo_usuario', getAllByRol); // /api/user_data/getAllByRol
router.get('/getById/:id', getById); // /api/user_data/getById
router.put('/changeState/:id', changeState); // /api/user_data/changeState

module.exports = router;
