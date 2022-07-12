const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models");
app.use(cors());
require("dotenv").config();
app.use(express.json());
//Router paths
const postsRouter = require("./routes/Posts");
app.use("/posts", postsRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/users", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

const commentLikeRouter = require("./routes/CommentLike");
app.use("/commentLike", commentLikeRouter);

const playlistRouter = require("./routes/PlayList");
app.use("/playlist", playlistRouter);

//Server DB start
db.sequelize
  .sync({ alter: true, force: false })
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
