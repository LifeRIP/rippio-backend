const express = require ('express');
const authcontroller = requiere ('./controllers/authcontroller')

const router =  express.Router();

router.post('/login', authcontroller.login);

router.route('/forgot-password', authcontroller.forgotPassword);
router.route('/reset-password', authcontroller.resetPassword);


router.route('/search/:id_restaurante', authcontroller.searchProducto);
router.get('/search/:id_restaurante', searchProducto);