const express = require("express");

const { authMiddleware } = require("../middleware/auth");
const {
  register,
  login,
  getInterestedEvents,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/interested-events", authMiddleware, getInterestedEvents);
 
module.exports = router;