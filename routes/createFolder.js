


const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();

const router = express.Router();

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION
});

const bucketName = process.env.BUCKET_NAME;

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to create a new folder and upload an image
router.post('/:folderName', upload.single('file'), async (req, res) => {
  const folderName = req.params.folderName;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const imageKey = `${folderName}/${file.originalname}`;

  try {
    // Check if the folder exists by listing objects with the folder prefix
    const data = await s3.listObjectsV2({
      Bucket: bucketName,
      Prefix: `${folderName}/`
    }).promise();

    // If the folder doesn't exist, create it by uploading a dummy file
    if (data.KeyCount === 0) {
      await s3.putObject({
        Bucket: bucketName,
        Key: `${folderName}/`,
        Body: ''
      }).promise();
    }

    // Upload the image file to S3
    await s3.putObject({
      Bucket: bucketName,
      Key: imageKey,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise();

    res.send(`Image '${file.originalname}' uploaded to folder '${folderName}' successfully`);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;








