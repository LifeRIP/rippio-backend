const express = require('express');
const router = express.Router();
const {
  getAll
} = require('../controllers/category.controller');

router.get('/getAll', getAll); // /api/category/getAll

module.exports = router;
