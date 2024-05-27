const express = require('express');
const router = express.Router();
const {
  getTopByCity,
  getById,
  getCatAndProdByResId,
} = require('../controllers/restaurant.controller');

router.get('/getTopByCity', getTopByCity); // /api/restaurant/getTopByCity
router.get('/getById/:id', getById); // /api/restaurant/getById
router.get('/getProfileById/:id'); // /api/restaurant/getProfileById
router.get('/getCatAndProdByResId/:id', getCatAndProdByResId); // /api/restaurant/getCatAndProdByResId

module.exports = router;
