module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define("CommentLike");

  return CommentLike;
};
