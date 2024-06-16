const express = require('express');
const router = express.Router();
const { getMostRequested } = require('../controllers/most_request.controller');

router.get('/most_request', getMostRequested); // /api/most_request/most_request

module.exports = router;
