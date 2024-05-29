const express = require('express');
const router = express.Router();
const auth_user = require('../middleware/auth.user.middleware');
const {
  change_data,
  change_password,
  add_address,
  modify_address,
  getAddressById,
  modify_profile_image,
  modify_banner_restaurant,
  add_payment_method,
  modify_payment_method,
  get_payment_methods,
  get_type_payment_methods,
} = require('../controllers/edit.profile.controller');

router.post('/edit', auth_user, change_data); // /api/profile/edit
router.post('/change_password', auth_user, change_password); // /api/profile/change_password
router.post('/add_address', auth_user, add_address); // /api/profile/add_address
router.post('/modify_address', auth_user, modify_address); // /api/profile/modify_address
router.get('/get_address_by_id', auth_user, getAddressById); // /api/profile/get_address_by_id
router.post('/modify_profile_image', auth_user, modify_profile_image); // /api/profile/modify_profile_image
router.post('/modify_banner_restaurant', auth_user, modify_banner_restaurant); // /api/profile/modify_banner_restaurant
router.post('/add_payment_method', auth_user, add_payment_method); // /api/profile/add_payment_method
router.post('/modify_payment_method', auth_user, modify_payment_method); // /api/profile/modify_payment_method
router.get('/get_payment_methods', auth_user, get_payment_methods); // /api/profile/get_payment_methods
router.get('/get_type_payment_methods', auth_user, get_type_payment_methods); // /api/profile/get_type_payment_methods
module.exports = router;
