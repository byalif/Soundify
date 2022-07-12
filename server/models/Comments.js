module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comments.associate = (models) => {
    Comments.hasMany(models.CommentLike, {
      onDelete: "cascade",
    });
  };

  return Comments;
};
