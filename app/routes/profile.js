const express = require('express');
const router = express.Router();
const auth_user = require('../middleware/auth.user.middleware');
const {
  change_data,
  change_password,
  add_address,
  modify_address,
} = require('../controllers/edit.profile.controller');

router.post('/edit', auth_user, change_data); // /api/profile/edit
router.post('/change_password', auth_user, change_password); // /api/profile/change_password
router.post('/add_address', auth_user, add_address); // /api/profile/add_address
router.post('/modify_address', auth_user, modify_address); // /api/profile/modify_address

module.exports = router;
