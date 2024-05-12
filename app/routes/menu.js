const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.user.middleware');
const { AggMenu } = require('../controllers/Menu.controller');
const { InhabMenu } = require('../controllers/InhabilitateMenu.controller');

router.post('/AggMenu', auth, AggMenu); // /api/menu/AggMenu
router.post('/InhabMenu', auth, InhabMenu);// /api/menu/InhabMenu

module.exports = router;