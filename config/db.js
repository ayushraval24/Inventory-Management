console.log("Live: ", process.env.LIVE);

module.exports = {
  HOST: process.env.LIVE ? process.env.DATABASE_HOST : "localhost",
  user: process.env.LIVE ? process.env.DATABASE_USER : "root",
  password: process.env.LIVE ? process.env.DATABASE_PASSWORD : "",
  DB: process.env.LIVE ? process.env.DATABASE_NAME : "inventory",
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
