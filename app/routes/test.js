const express = require('express');
const auth_user = require('../middleware/auth.user.middleware');
const router = express.Router();
const { masivedata } = require('../controllers/test.controller');

router.post('/masivedata', auth_user, masivedata); // /api/test/masivesedata

module.exports = router;
