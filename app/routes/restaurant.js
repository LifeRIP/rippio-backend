const express = require('express');
const router = express.Router();
const {
  getAll,
  getTopCiudad,
} = require('../controllers/restaurant.controller');

router.get('/getAll', getAll); // /api/restaurant/getAll
router.get('/getTopCiudad', getTopCiudad); // /api/restaurant/getTopCiudad

module.exports = router;
