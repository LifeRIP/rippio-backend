const express = require('express');
const auth_user = require('../middleware/auth.user.middleware');
const router = express.Router();
const {
    addSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    } = require('../controllers/schedule.controller');

router.post('/addSchedule', auth_user, addSchedule); // /api/schedule/addSchedule
router.get('/getSchedule', auth_user, getSchedule); // /api/schedule/getSchedule
router.put('/updateSchedule', auth_user, updateSchedule); // /api/schedule/updateSchedule
router.delete('/deleteSchedule', auth_user, deleteSchedule); // /api/schedule/deleteSchedule


module.exports = router;
