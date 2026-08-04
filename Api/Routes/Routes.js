const express = require("express");
const router = express.Router();

const registerController = require("../Controller/registerController");

router.post("/register", registerController.register);
router.post("/login", registerController.authenticate);
router.get("/fetch-user", registerController.fetchUser);
router.post("/logout", registerController.logout);

module.exports = router;