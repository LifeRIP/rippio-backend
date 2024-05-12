const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.user.middleware');
const { AggMenu } = require('../controllers/Menu.controller');

router.post('/AggMenu', auth, AggMenu); // /api/menu/AggMenu

module.exports = router;