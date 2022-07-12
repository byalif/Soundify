const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { verifyToken } = require("../middleware/Verify.js");

router.post("/", verifyToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  if (found) {
    await Likes.destroy({ where: { PostId: PostId, UserId: UserId } });
    res.json("succesfully unliked");
  } else {
    await Likes.create({ PostId: PostId, UserId: UserId });
    res.json("succesfully liked");
  }
});

module.exports = router;
