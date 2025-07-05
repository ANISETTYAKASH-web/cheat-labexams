const { Pool } = require("pg");
const url = require("url");
const params = url.parse(process.env.DB_STRING);
const auth = params.auth.split(":");
console.log(auth[0]);
console.log(auth[1]);
console.log(params.hostname);
console.log(params.port);
console.log(params.pathname.split("/")[1]);
const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: true,
};

const pool = new Pool(config);

pool.on("connect", () => {
  console.log("database connected");
});
pool.on("release", () => {
  console.log("database released");
});
module.exports = pool;
