const aws = require("@aws-sdk/client-s3");

require("dotenv").config();
const S3Client = new aws.S3Client({
  region: "APAC",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const params = {
  key:
}