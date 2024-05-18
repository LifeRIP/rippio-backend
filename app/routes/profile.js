const express = require('express');
const router = express.Router();
const auth_user = require('../middleware/auth.user.middleware');
const {
  change_data,
  change_password,
  add_address,
  modify_address,
  modify_profile_image,
  modify_banner_restaurant
} = require('../controllers/edit.profile.controller');

router.post('/edit', auth_user, change_data); // /api/profile/edit
router.post('/change_password', auth_user, change_password); // /api/profile/change_password
router.post('/add_address', auth_user, add_address); // /api/profile/add_address
router.post('/modify_address', auth_user, modify_address); // /api/profile/modify_address
router.post('/modify_profile_image', auth_user, modify_profile_image); // /api/profile/modify_profile_image
router.post('/modify_banner_restaurant', auth_user, modify_banner_restaurant); // /api/profile/modify_banner_restaurant
module.exports = router;
