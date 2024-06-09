const express = require('express');
const router = express.Router();
const { add_order,getByUserID,getDetail,orderStatus } = require('../controllers/order.controller');
const auth_user = require('../middleware/auth.user.middleware');

router.post('/add',auth_user, add_order); // /api/order/add
router.get('/getByUserID',auth_user, getByUserID); // /api/order/getByUserID
router.post('/getDetail', getDetail); // /api/order/getDetail
router.put('/status',auth_user, orderStatus); // /api/order/status

module.exports = router;
