const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/plan.controller');

router.get('/getAll', getAll); // /api/plan/getAll

module.exports = router;
