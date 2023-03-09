const express = require("express");
const router = express.Router();
const { signup, github, login, google } = require("../controllers/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/github", github);
router.get("/google", google);

module.exports = router;
