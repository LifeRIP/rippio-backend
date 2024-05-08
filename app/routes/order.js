const express = require('express');
const router = express.Router();
const { getByUserID } = require('../controllers/order.controller');

router.get('/getByUserID/:id', getByUserID); // /api/order/getByUserID/:id

module.exports = router;
