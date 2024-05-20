const express = require('express');
const router = express.Router();
const { getByResName } = require('../controllers/platillos.controller');

router.get('/getByResName/:id', getByResName); // /api/platillos/getByResName/:id

module.exports = router;