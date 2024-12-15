const express = require('express');
const router = express.Router();
const {
  getMostPopularRestaurants,
  getMostRequestedDays,
  getAverageSpending,
  getMostSoldProducts,
} = require('../controllers/statistics.controller');

router.get('/getMostPopularRestaurants', getMostPopularRestaurants); // /api/statistics/getMostPopularRestaurants
router.get('/getMostRequestedDays', getMostRequestedDays); // /api/statistics/getMostRequestedDays
router.get('/getAverageSpending', getAverageSpending); // /api/statistics/getAverageSpending
router.get('/getMostSoldProducts', getMostSoldProducts); // /api/statistics/getMostSoldProducts

module.exports = router;
