const express = require('express');
const router = express.Router();
const {
  getAll,
  getTopByCity,
  getById,
  getCatAndProdByResId,
} = require('../controllers/restaurant.controller');

router.get('/getAll', getAll); // /api/restaurant/getAll
router.get('/getTopByCity', getTopByCity); // /api/restaurant/getTopByCity
router.get('/getById/:id', getById); // /api/restaurant/getById
router.get('/getCatAndProdByResId/:id', getCatAndProdByResId); // /api/restaurant/getCatAndProdByResId

module.exports = router;
