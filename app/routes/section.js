const express = require('express');
const auth_user = require('../middleware/auth.user.middleware');
const router = express.Router();
const {
    AggSect,
    DelSect,
    ModSect,
    getSectionsByRestaurantId
} = require('../controllers/section.controller');

router.post('/AggSect', auth_user, AggSect); // /api/section/AggSect
router.post('/DelSect', auth_user, DelSect); // /api/section/DelSect
router.post('/ModSect', auth_user, ModSect); // /api/section/ModSect
router.get('/getSectionsByRestaurantId', auth_user, getSectionsByRestaurantId); // /api/section/getSectionsByRestaurantId

module.exports = router;