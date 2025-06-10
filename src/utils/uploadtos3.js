// const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// const multer = require('multer');

// // Configure AWS S3 with your credentials
// const s3Client = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
// });

// // Set up multer for handling file uploads
// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
//   });

  
// const uploadToS3 = async (file, folderName = '') => {
//     // Check if file is an array and access the first item if so
//     const fileToUpload = Array.isArray(file) ? file[0] : file;

//     // Log file details to ensure it's being passed correctly
//     // console.log('File details:', fileToUpload);

//     if (!fileToUpload || !fileToUpload.originalname) {
//         throw new Error("File original name is missing!");
//     }

//     const fileName = `${Date.now()}-${fileToUpload.originalname}`;
//     // console.log("Generated File Name:", fileName);

//     const uploadParams = {
//         Bucket: process.env.S3_BUCKET_NAME || 'asp-hifah',
//         Key: `${folderName ? folderName : ''}${fileName}`, // Use folderName and the generated file name
//         Body: fileToUpload.buffer,
//         ContentType: fileToUpload.mimetype, // Ensure correct content type
//     };

//     // console.log("Upload Params: ", uploadParams); // Log the upload params to check correctness

//     try {
//         const command = new PutObjectCommand(uploadParams);
//         await s3Client.send(command);

//         // Check if the file is successfully uploaded
//         const uploadedUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
//         // console.log("File uploaded successfully. URL:", uploadedUrl); // Log the URL

//         return uploadedUrl;
//     } catch (error) {
//         console.error('Error uploading to S3:', error);
//         throw error;
//     }
// };

// // New function to delete file from S3
// const deleteFromS3 = async (fileUrl) => {
//     try {
//         if (!fileUrl) {
//             throw new Error("File URL is required to delete from S3.");
//         }

//         // Extract file key from URL
//         const fileKey = fileUrl.split('.amazonaws.com/')[1];

//         if (!fileKey) {
//             throw new Error("Invalid file URL. Unable to extract key.");
//         }

//         const deleteParams = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: fileKey,
//         };

//         const command = new DeleteObjectCommand(deleteParams);
//         await s3Client.send(command);

//         console.log(`File deleted from S3: ${fileKey}`);
//         return true;
//     } catch (error) {
//         console.error('Error deleting from S3:', error);
//         throw error;
//     }
// };

// module.exports = { upload, uploadToS3, deleteFromS3 };


const multer = require('multer');
const admin = require('./firebase'); // adjust to the path of your firebase admin setup
const { v4: uuidv4 } = require('uuid');

const bucket = admin.storage().bucket();

// Set up multer for handling file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// Upload function (still called uploadToS3 for compatibility)
const uploadToS3 = async (file, folderName = '') => {
    const fileToUpload = file;

    if (!fileToUpload || !fileToUpload.originalname) {
        throw new Error("File original name is missing!");
    }

    const fileName = `hifah-technology/${folderName}/${Date.now()}-${fileToUpload.originalname}`;
    const fileUpload = bucket.file(fileName);
    const uuid = uuidv4();

    const stream = fileUpload.createWriteStream({
        metadata: {
            contentType: fileToUpload.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: uuid,
            },
        },
    });

    return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
            console.error('Error uploading to Firebase:', error);
            reject(error);
        });

        stream.on('finish', () => {
            const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
            resolve(downloadUrl);
        });

        stream.end(fileToUpload.buffer);
    });
};

// Delete function (still called deleteFromS3 for compatibility)
const deleteFromS3 = async (fileUrl) => {
    try {
        if (!fileUrl) throw new Error("File URL is required to delete.");

        const matches = fileUrl.match(/\/o\/(.*?)\?/);
        if (!matches || !matches[1]) throw new Error("Invalid Firebase file URL.");

        const filePath = decodeURIComponent(matches[1]);
        await bucket.file(filePath).delete();

        console.log(`File deleted from Firebase: ${filePath}`);
        return true;
    } catch (error) {
        console.error('Error deleting from Firebase:', error);
        throw error;
    }
};

module.exports = { upload, uploadToS3, deleteFromS3 };
