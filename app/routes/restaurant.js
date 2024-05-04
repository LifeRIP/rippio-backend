const express = require("express");
const router = express.Router();
const { getAllRestaurant } = require("../controllers/restaurant.controller");

router.get("/getAllRestaurant", getAllRestaurant); // /api/restaurant/getAllRestaurant

module.exports = router;
