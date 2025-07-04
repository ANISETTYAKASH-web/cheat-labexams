const express = require("express");
const dbController = require("../controller/dbController");
const router = express.Router();
router.get("/myfiles/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const result = await dbController.get_files(user_id);
  const urls = result.map((files) => files.public_url);
  console.log(urls);
  res.status(400).json(result);
});
module.exports = router;
