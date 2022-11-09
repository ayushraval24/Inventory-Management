module.exports = (sequelize, DataTypes) => {
  const Bug = sequelize.define("bug", {
    subject: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
    },
  });
  return Bug;
};
