const express = require('express');
const router = express.Router();
const {
  getByResID,
  getByResProd,
} = require('../controllers/product.controller');

router.get('/getByResID/:id', getByResID); // /api/product/getByResID/:id
router.get('/getByResProd/:id', getByResProd); // /api/product/getByResProd/:id

module.exports = router;
