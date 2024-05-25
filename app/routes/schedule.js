const express = require('express');
const router = express.Router();
const {
    addSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    } = require('../controllers/schedule.controller');

router.post('/addSchedule', addSchedule); // /api/schedule/addSchedule
router.get('/getSchedule', getSchedule); // /api/schedule/getSchedule
router.put('/updateSchedule', updateSchedule); // /api/schedule/updateSchedule
router.delete('/deleteSchedule', deleteSchedule); // /api/schedule/deleteSchedule