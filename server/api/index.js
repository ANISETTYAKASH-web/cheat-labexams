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
const upload = multer({ storage });

app.post("/upload", upload.array("files"), (req, res) => {
  console.log(req.files);
  res.json({ message: "success" });
});
app.use("/", S3URL);
app.use("/get", getFiles);
app.get("/check", (req, res) => {
  res.json({ message: "hey" });
});
