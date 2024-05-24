const express = require('express');
const auth_user = require('../middleware/auth.user.middleware');
const router = express.Router();
const {
  add,
  remove,
  update,
  getByResId,
} = require('../controllers/section.controller');

router.post('/add', auth_user, add); // /api/section/add
router.post('/delete', auth_user, remove); // /api/section/remove
router.post('/update', auth_user, update); // /api/section/update
router.get('/getByResId', auth_user, getByResId); // /api/section/getByResId

module.exports = router;
