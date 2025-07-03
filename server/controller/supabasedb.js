const pool = require("../config/db");
require("dotenv").config();
async function insert_user(sessionId) {
  const client = await pool.connect();
  try {
    const query =
      'INSERT INTO "cheat-labs".users (id) VALUES ($1) RETURNING *;';
    const result = await client.query(query, [sessionId]);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
}
async function insert_files(sessionId, fileName) {
  const client = await pool.connect();
  try {
    const public_url = process.env.PUBLIC_URL + sessionId + "/" + fileName;
    const query =
      'INSERT INTO "cheat-labs".user_files(id,public_url) VALUES ($1,$2);';
    const result = await client.query(query, [sessionId, public_url]);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}
module.exports = { insert_user, insert_files };
