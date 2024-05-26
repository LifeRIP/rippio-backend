const express = require('express');
const router = express.Router();
const auth_user = require('../middleware/auth.user.middleware');
const {
  getByResID,
  getByResProd,
  add,
  updateState,
  updateSeccionProd,
  updateProd,
  deleteProd,
} = require('../controllers/product.controller');

router.get('/getByResID/:id', getByResID); // /api/product/getByResID/:id
router.get('/getByResProd/:id', getByResProd); // /api/product/getByResProd/:id
router.post('/add', auth_user, add); // /api/product/add
router.post('/updateState', auth_user, updateState); // /api/product/updateState
router.post('/updateSeccionProd', auth_user, updateSeccionProd); // /api/product/updateSeccionProd
router.post('/updateProd', auth_user, updateProd); // /api/product/updateProd
router.post('/deleteProd', auth_user, deleteProd); // /api/product/deleteProd


module.exports = router;
