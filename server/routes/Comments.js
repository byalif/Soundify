const express = require("express");
const router = express.Router();
const { Comments, CommentLike } = require("../models");
const { verifyToken } = require("../middleware/Verify.js");

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const allCom = await Comments.findAll({
    where: { PostId: postId },
    include: [CommentLike],
  });
  res.json(allCom);
});

router.delete("/delete/:commentId", verifyToken, async (req, res) => {
  const { commentId } = req.params;
  await Comments.destroy({ where: { id: commentId } });
  res.json("deleted succesfully");
});

router.post("/", verifyToken, async (req, res) => {
  const { comment, PostId } = req.body;
  const com = {
    comment,
    PostId,
    UserId: req.user.id,
    username: req.user.username,
  };
  await Comments.create(com);
  res.json(com);
});

module.exports = router;
