const express = require('express');
const router = express.Router();
const {
  getTopByCity,
  getCatAndProdByResId,
  getInfoById,
  getByCategory,
  PageRestaurant,
  getByCity
} = require('../controllers/restaurant.controller');

router.get('/getTopByCity', getTopByCity); // /api/restaurant/getTopByCity
router.get('/getProfileById/:id', getInfoById); // /api/restaurant/getProfileById
router.get('/getCatAndProdByResId/:id', getCatAndProdByResId); // /api/restaurant/getCatAndProdByResId
router.get('/getByCategory/:id_category', getByCategory); // /api/restaurant/getByCategory
router.get('/PageRestaurant', PageRestaurant); // /api/restaurant/PageRestaurant
router.get('/getByCity', getByCity); // /api/restaurant/getByCity

module.exports = router;
