const express = require('express');
const router = express.Router();
const { getByResID } = require('../controllers/product.controller');

router.get('/getByResID/:id', getByResID); // /api/product/getByResID/:id

module.exports = router;
