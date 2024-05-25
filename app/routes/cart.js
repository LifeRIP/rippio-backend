const express = require('express');
const router = express.Router();
const {
  add,
  get,
  removeByProdId,
  empty,
} = require('../controllers/cart.controller');
const auth_user = require('../middleware/auth.user.middleware');

router.post('/add', auth_user, add); // /api/cart/add
router.get('/get', auth_user, get); // /api/cart/get
router.delete('/removeByProdId/:id_producto', auth_user, removeByProdId); // /api/cart/remove
router.delete('/empty', auth_user, empty); // /api/cart/empty

module.exports = router;
