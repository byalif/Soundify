const express = require("express");
const router = express.Router();
//sql schema stuff
const { Posts, Likes, Comments, CommentLike } = require("../models");
//File upload stuff
const AWS = require("aws-sdk");
const multer = require("multer");
const { memoryStorage } = require("multer");
const { verify } = require("jsonwebtoken");
const { verifyToken } = require("../middleware/Verify.js");
const storage = memoryStorage();
const upload = multer({ storage });
//

const bucket = "july22proj";

const s3 = new AWS.S3({
  accessKeyId: "AKIAWWWNOP2KG2FQXYAI",
  secretAccessKey: "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",
});

const uploadAudio = (filename, bucketName, file) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: filename,
      Bucket: bucketName,
      Body: file,
      ContentType: "audio/mpeg",
      ACL: "public-read",
    };
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

router.post("/upload", upload.single("audio"), async (req, res) => {
  const file = req.file.buffer;
  let title = req.file.originalname;

  const link = await uploadAudio(title, "july22proj", file);
  console.log("succesfully " + link);
  res.json(link);
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Posts.destroy({ where: { id: id } });
  res.json({ status: "DELETED" });
});

router.get("/", async (req, res) => {
  const list = await Posts.findAll({ include: [Likes, Comments] }); //waiting to recieve all
  res.json(list);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findByPk(id, { include: [Likes, Comments] });
  res.json(post);
});

router.post("/", async (req, res) => {
  const post = req.body;
  await Posts.create(post);
  res.json(post);
});

router.post("/plays", async (req, res) => {
  const { id } = req.body;
  const post = await Posts.findByPk(id);
  let plays = post.plays;
  await Posts.update(
    { plays: plays + 1 },
    {
      where: {
        id: id,
      },
    }
  );
  res.json("updated!");
});

module.exports = router;
