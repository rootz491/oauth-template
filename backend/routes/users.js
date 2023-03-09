const express = require("express");
const router = express.Router();

const {
	connectGithub,
	disconnectGithub,
	connectGoogle,
	disconnectGoogle,
	user,
} = require("../controllers/user");

router.get("/", user);

router.post("/connect/github", connectGithub);
router.delete("/connect/github", disconnectGithub);

router.post("/connect/google", connectGoogle);
router.delete("/connect/google", disconnectGoogle);

module.exports = router;
