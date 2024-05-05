const express = require("express");
const router = express.Router();
const { getAllRestaurant, getTopCiudad } = require("../controllers/restaurant.controller");

router.get("/getAll", getAllRestaurant); // /api/restaurant/getAllRestaurant
router.get("/getTopCiudad", getTopCiudad); // /api/restaurant/getTopCiudad

module.exports = router;
