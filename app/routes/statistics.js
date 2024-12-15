const express = require('express');
const router = express.Router();
const {
  getMostPopularRestaurants,
  getMostRequestedDays,
  getAverageSpending,
} = require('../controllers/statistics.controller');

router.get('/getMostPopularRestaurants', getMostPopularRestaurants); // /api/statistics/getMostPopularRestaurants
router.get('/getMostRequestedDays', getMostRequestedDays); // /api/statistics/getMostRequestedDays
router.get('/getAverageSpending', getAverageSpending); // /api/statistics/getAverageSpending

module.exports = router;
