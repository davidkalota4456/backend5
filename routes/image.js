const express = require('express');
const router = express.Router();
const { Cars, Image } = require('../models'); // Import Cars and Images models
const { where } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();


const s3 = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const bucketName = process.env.BUCKET_NAME;

if (!bucketName) {
    console.error('Bucket name is missing in environment variables');
}

router.get('/:carName', async (req, res) => {
    const { carName } = req.params;
    const folderPath = `${carName}/`;

    try {
        // List objects in the specified folder
        const data = await s3.send(new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: folderPath
        }));

        // Filter out directory names (keys ending with '/')
        const imageKeys = data.Contents
            .map(item => item.Key)
            .filter(key => !key.endsWith('/')); 

        console.log(imageKeys);

        if (imageKeys.length === 0) {
            return res.status(404).json({ message: 'No images found for this car' });
        }

        // Fetch each image and convert to base64
        const images = await Promise.all(imageKeys.map(async key => {
            try {
                const image = await s3.send(new GetObjectCommand({
                    Bucket: bucketName,
                    Key: key
                }));

                const buffer = await image.Body.transformToByteArray();
                return `data:${image.ContentType};base64,${Buffer.from(buffer).toString('base64')}`;
            } catch (fetchError) {
                console.error('Error fetching image:', fetchError);
                return null;
            }

        }));

        const validImages = images.filter(image => image !== null);

        if (validImages.length === 0) {
            return res.status(404).json({ message: 'No valid images found for this car' });
        }

        res.json(validImages);
    } catch (error) {
        console.error('Error listing objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/:carName', async (req, res) => {
    const { carName } = req.params;
    const directoryPath = path.join(__dirname, '../public/assets/images', carName);

    try {
        const imageFiles = await fs.readdir(directoryPath);
        const images = await Promise.all(imageFiles.map(async file => {
            const filePath = path.join(directoryPath, file);
            const imageBuffer = await fs.readFile(filePath);
            const base64Image = imageBuffer.toString('base64');
            return base64Image;
        }));

        res.json(images); // Send array of base64-encoded images to frontend
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// POST upload image for a specific car
router.post('/', async (req, res) => {
    const { carName, carImageLocation } = req.body;

    try {
        // Check if carName and carImageLocation are provided
        if (!carName || !carImageLocation) {
            return res.status(400).json({ error: 'carName and carImageLocation are required' });
        }

        // Find the car by name
        const findCar = await Cars.findOne({ where: { name: carName } });

        if (!findCar) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Create a new image entry
        const image = await Image.create({
            carName: carName,
            Picture: `/assets/images/${carImageLocation}` // Adjust the path based on your folder structure
        });

        res.status(201).json(image);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
