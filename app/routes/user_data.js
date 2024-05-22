const express = require('express');
const router = express.Router();
const { getAll, getById } = require('../controllers/user_data.controller');

router.get('/getAll', getAll); // /api/user_data/getAll
router.get('/getById', getById); // /api/user_data/getById

module.exports = router;
