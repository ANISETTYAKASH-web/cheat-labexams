const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const S3URL = require("../routes/S3ConnectRoute");
const getFiles = require("../routes/downloadUrl");
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
  console.log(`listening on port:${PORT}`);
});

app.use("/", S3URL);
app.use("/get", getFiles);
app.get("/api", (req, res) => {
  res.json({ message: "hey" });
});
