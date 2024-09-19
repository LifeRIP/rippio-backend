const express = require('express');
const router = express.Router();
const {
  createchat_order,
  getchat_order,
  insertchat_order,
  createchat_admin,
  getchat_admin,
  insertchat_admin,
} = require('../controllers/chat.controller');
const auth_user = require('../middleware/auth.user.middleware');

router.post('/createchat_order', auth_user, createchat_order); // /api/chat/createchat_order
router.get('/getchat_order', auth_user, getchat_order); // /api/chat/getchat_order
router.post('/insertchat_order', auth_user, insertchat_order); // /api/chat/insertchat_order

module.exports = router;
