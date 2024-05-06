const express = require('express');
const router = express.Router();
const { getResID } = require('../controllers/product.controller');

router.get('/getResID/:id', getResID); // /api/product/getResID/:id

module.exports = router;
