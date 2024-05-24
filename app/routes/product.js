const express = require('express');
const router = express.Router();
const {
  getByResID,
  getByResProd,
  AggMenu,
  InhabMenu
} = require('../controllers/product.controller');

router.get('/getByResID/:id', getByResID); // /api/product/getByResID/:id
router.get('/getByResProd/:id', getByResProd); // /api/product/getByResProd/:id
router.post('/AggMenu', auth, AggMenu); // /api/product/AggMenu
router.post('/InhabMenu', auth, InhabMenu);// /api/product/InhabMenu

module.exports = router;
