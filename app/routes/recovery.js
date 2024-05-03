const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../controllers/recovery.controller");

router.post("/forgot-password", forgotPassword); // /api/recovery/forgot-password
router.post("/reset-password", resetPassword); // /api/recovery/reset-password

module.exports = router;