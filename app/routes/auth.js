const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');

router.post('/login', login); // /api/auth/login
router.post('/register', register); // /api/auth/register

module.exports = router;
