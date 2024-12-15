const express = require('express');
const router = express.Router();
const {
  getMostPopularRestaurants,
  getMostRequestedDays,
} = require('../controllers/statistics.controller');

router.get('/getMostPopularRestaurants', getMostPopularRestaurants); // /api/statistics/getMostPopularRestaurants
router.get('/getMostRequestedDays', getMostRequestedDays); // /api/statistics/getMostRequestedDays

module.exports = router;
