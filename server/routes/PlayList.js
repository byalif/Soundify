const express = require("express");
const router = express.Router();
const { PlayList, Posts, Likes, Comments } = require("../models");
const { verifyToken } = require("../middleware/Verify.js");

router.post("/single", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { title } = req.body;
  const playlists = await PlayList.findAll({
    where: { UserId: id, title: title },
  });

  const results = await Posts.findAll({ include: [Likes, Comments] });

  let obj = [];
  results.forEach((x) => {
    playlists.forEach((y) => {
      if (x.id == y.PostId) {
        obj.push(x);
      }
    });
  });
  res.json(obj);
});

router.get("/", verifyToken, async (req, res) => {
  const { id } = req.user;
  const playlists = await PlayList.findAll({
    where: { UserId: id },
  });

  const unq = new Set();
  playlists.forEach((x) => {
    unq.add(x.title);
  });

  res.json(Array.from(unq));
});

router.post("/add", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { PostId, title } = req.body;

  const found = await PlayList.findOne({
    where: { UserId: id, PostId: PostId, title: title },
  });

  if (found) {
    await PlayList.destroy({
      where: { UserId: id, PostId: PostId, title: title },
    });
    res.json("Song unadded from playlist!");
  } else {
    await PlayList.create({ UserId: id, PostId: PostId, title: title });
    res.json(`Song added to playlist ${title}`);
  }
});

router.post("/createPlaylist", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { title } = req.body;

  const found = await PlayList.findAll({
    where: { title: title, UserId: id },
  });

  if (found.length != 0) {
    res.json({ status: "ALREADY_EXISTS", found });
  } else {
    await PlayList.create({ UserId: id, PostId: null, title: title });
    res.json({ status: "CREATED" });
  }
});

router.post("/addOnly", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { PostId, title } = req.body;

  const found = await PlayList.findOne({
    where: { UserId: id, PostId: PostId, title: title },
  });

  if (found) {
    res.json({ status: "ALREADY_ADDED" });
  } else {
    await PlayList.create({ UserId: id, PostId: PostId, title: title });
    res.json(`Song added to playlist ${title}`);
  }
});

router.delete("/deletePlaylist/:id/:title", verifyToken, async (req, res) => {
  const { id, title } = req.params;
  console.log(`${title}, ${id}`);
  await PlayList.destroy({ where: { UserId: id, title: title } });
  res.json("deleted!");
});

module.exports = router;
