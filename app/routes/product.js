const express = require('express');
const router = express.Router();
const {
  getByResID,
  getByResProd,
  AggProd,
  InhabProd
} = require('../controllers/product.controller');

router.get('/getByResID/:id', getByResID); // /api/product/getByResID/:id
router.get('/getByResProd/:id', getByResProd); // /api/product/getByResProd/:id
router.post('/AggMenu', auth, AggProd); // /api/product/AggProd
router.post('/InhabMenu', auth, InhabProd);// /api/product/InhabProd

module.exports = router;
