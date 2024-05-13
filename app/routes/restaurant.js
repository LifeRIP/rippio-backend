const express = require('express');
const router = express.Router();
const {
  getAll,
  getTopByCity,
  getRestaurantInfoById,
  getCategoriesAndProductsByRestaurantId
} = require('../controllers/restaurant.controller');

router.get('/getAll', getAll); // /api/restaurant/getAll
router.get('/getTopByCity', getTopByCity); // /api/restaurant/getTopByCity
router.get('/getRestaurantInfoById/:id', getRestaurantInfoById); // /api/restaurant/getRestaurantInfoById
router.get('/getCategoriesAndProductsByRestaurantId/:id', getCategoriesAndProductsByRestaurantId); // /api/restaurant/getCategoriesAndProductsByRestaurantId

module.exports = router;
