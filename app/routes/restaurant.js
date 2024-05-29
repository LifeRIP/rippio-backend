const express = require('express');
const router = express.Router();
const {
  getTopByCity,
  getById,
  getCatAndProdByResId,
  getByCategory,
} = require('../controllers/restaurant.controller');

router.get('/getTopByCity', getTopByCity); // /api/restaurant/getTopByCity
router.get('/getById/:id', getById); // /api/restaurant/getById
router.get('/getProfileById/:id'); // /api/restaurant/getProfileById
router.get('/getCatAndProdByResId/:id', getCatAndProdByResId); // /api/restaurant/getCatAndProdByResId
router.get('/getByCategory/category', getByCategory); // /api/restaurant/getByCategory

module.exports = router;
