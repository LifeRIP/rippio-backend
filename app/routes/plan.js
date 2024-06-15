const express = require('express');
const router = express.Router();
const { getAll} = require('../controllers/plan.controller');
const {
    getPlan,
    getById,
    cancelPlan

} = require('../controllers/plan_usuario.controller');
const auth_user = require('../middleware/auth.user.middleware');


router.get('/getAll', getAll); // /api/plan/getAll
router.post('/getPlan', auth_user, getPlan); // /api/plan/getPlan
router.get('/getById', auth_user, getById); // /api/plan/getById
router.post('/cancelPlan', auth_user, cancelPlan); // /api/plan/cancelPlan

module.exports = router;