const aws = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const dbController = require("./dbController");
const S3Client = new aws.S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_ENDPOINT,
});

const bucket = process.env.R2_BUCKET;
async function get_url(req, res) {
  const { fileName, fileType, sessionId } = req.body;
  const s3key = `${sessionId}/${fileName}`;
  //insert files in to db
  const result = dbController.insert_user(sessionId);
  dbController.insert_files(sessionId, fileName);
  console.log(result);
  const params = {
    Bucket: bucket,
    Key: s3key,
    ContentType: fileType,
    ACL: "public-read-write",
  };
  const command = new aws.PutObjectCommand(params);

  try {
    const url = await getSignedUrl(S3Client, command, { expiresIn: 3600 });

    res.status(200).json({ url, s3key });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "not getting url from cloud" });
  }
}
module.exports = { get_url };
