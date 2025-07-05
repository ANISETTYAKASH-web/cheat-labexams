const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DB_STRING,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
console.log(process.env.DB_STRING);
pool.on("connect", () => {
  console.log("database connected");
});
pool.on("release", () => {
  console.log("database released");
});
module.exports = pool;
