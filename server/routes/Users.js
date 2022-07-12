const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcyrpt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { verifyToken } = require("../middleware/Verify");

router.get("/auth", verifyToken, async (req, res) => {
  console.log("made it");
  res.json(req.user);
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const allUsers = await Users.findAll({ where: { id: userId } });
  res.json("okay");
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (user != null) {
    res.json({ status: "NOT_UNIQUE" });
    return;
  }
  bcyrpt.hash(password, 10).then((hash) => {
    Users.create({ username, password: hash });
  });
  res.json({ status: "SUCCESS" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user) {
    res.json({ status: "NOT_FOUND" });
    return;
  }

  bcyrpt.compare(password, user.password).then((x) => {
    if (!x) res.json({ status: "WRONG_PASSWORD" });
    else {
      const accessToken = sign(
        { username: user.username, id: user.id },
        "secret123"
      );
      res.json({ accessToken, status: "SUCCESS", username, id: user.id });
    }
  });
});

module.exports = router;
