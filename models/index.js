const dbConfig = require("../config/db");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.user, dbConfig.password, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database: ", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./UserModel.js")(sequelize, DataTypes);
db.products = require("./ProductModel")(sequelize, DataTypes);
db.categories = require("./CategoryModel")(sequelize, DataTypes);
db.bugs = require("./BugModel.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Yes re-sync done!");
});

// 1 to many category-products

db.categories.hasMany(db.products, {
  foreignKey: "category",
  as: "products",
});

db.products.belongsTo(db.categories, {
  foreignKey: "category",
  as: "categoryData",
});

module.exports = db;
