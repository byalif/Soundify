module.exports = (sequelize, DataTypes) => {
  const PlayList = sequelize.define("PlayList", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return PlayList;
};
