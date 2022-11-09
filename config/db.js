module.exports = {
  HOST: "localhost",
  user: "root",
  password: "",
  DB: "inventory",
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
