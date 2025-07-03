const s3controller = require("../controller/s3connect");

const express = require("express");
const router = express.Router();

router.post("/get_preassigned_url", s3controller.get_url);
module.exports = router;
