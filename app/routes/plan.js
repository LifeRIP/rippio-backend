const express = require('express');
const router = express.Router();
const { getAll} = require('../controllers/plan.controller');
const { getPlan } = require('../controllers/plan_usuario.controller');
const auth_user = require('../middleware/auth.user.middleware');


router.get('/getAll', getAll); // /api/plan/getAll
router.post('/getPlan', auth_user, getPlan); // /api/plan/getPlan

module.exports = router;
