const express = require ('express');
const authcontroller = requiere ('./controllers/authcontroller')

const router =  express.Router();

router.post('/login', authcontroller.login);

router.route('/forgot-password', authcontroller.forgotPassword);
router.route('/reset-password', authcontroller.resetPassword);