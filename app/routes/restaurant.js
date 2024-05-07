const express = require('express');
const router = express.Router();
const {
  getAll,
  getTopByCity,
} = require('../controllers/restaurant.controller');

router.get('/getAll', getAll); // /api/restaurant/getAll
router.get('/getTopByCity', getTopByCity); // /api/restaurant/getTopByCity

module.exports = router;
