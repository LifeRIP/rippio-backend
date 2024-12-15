const express = require('express');
const router = express.Router();
const {
  getMostPopularRestaurants,
} = require('../controllers/statistics.controller');

router.get('/getMostPopularRestaurants', getMostPopularRestaurants); // /api/search

module.exports = router;
