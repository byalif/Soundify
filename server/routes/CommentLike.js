const express = require("express");
const router = express.Router();
const { CommentLike } = require("../models");
const { verifyToken } = require("../middleware/Verify.js");

router.post("/", verifyToken, async (req, res) => {
  const { CommentId } = req.body;
  const UserId = req.user.id;

  const found = await CommentLike.findOne({
    where: { CommentId: CommentId, UserId: UserId },
  });

  if (found) {
    await CommentLike.destroy({
      where: { CommentId: CommentId, UserId: UserId },
    });
    res.json("succesfully unliked");
  } else {
    await CommentLike.create({ CommentId: CommentId, UserId: UserId });
    res.json("succesfully liked");
  }
});

module.exports = router;
