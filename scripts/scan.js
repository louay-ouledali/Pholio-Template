const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configuration
const DROPZONE_DIR = path.join(__dirname, '../_dropzone');

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET
});

// Firebase Config (Read from .env)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadToCloudinary(filePath, folderName) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `portfolio/projects/${folderName}`,
            use_filename: true,
            unique_filename: false,
            resource_type: "auto"
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload ${filePath}:`, error);
        return null;
    }
}

async function processFolder(folderName) {
    const folderPath = path.join(DROPZONE_DIR, folderName);
    if (!fs.lstatSync(folderPath).isDirectory()) return;

    console.log(`Processing ${folderName}...`);

    const files = fs.readdirSync(folderPath);
    const notesFile = files.find(f => f.toLowerCase() === 'notes.txt');
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));

    let description = "";
    if (notesFile) {
        description = fs.readFileSync(path.join(folderPath, notesFile), 'utf-8');
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    
    for (const img of imageFiles) {
        const oldPath = path.join(folderPath, img);
        console.log(`Uploading ${img}...`);
        const url = await uploadToCloudinary(oldPath, folderName);
        if (url) {
            uploadedImages.push(url);
        }
    }

    if (uploadedImages.length === 0 && imageFiles.length > 0) {
        console.error("No images were uploaded successfully. Skipping Firestore entry.");
        return;
    }

    // Construct Project Object
    const projectData = {
        title: folderName.replace(/-/g, ' '),
        description: description.substring(0, 150) + "...",
        longDescription: description,
        logo: uploadedImages[0] || "", // Use first image as logo
        media: uploadedImages.map(url => ({ type: 'image', src: url })), // New media format
        technologies: ["Detected from folder"], // Placeholder
        link: "#",
        linkText: "View Project",
        source: "local_dropzone",
        createdAt: new Date().toISOString()
    };

    // Push to Firestore
    try {
        await addDoc(collection(db, "projects"), projectData);
        console.log(`Successfully added ${folderName} to Firestore!`);
        
        // Optional: Rename folder to indicate processed
        // fs.renameSync(folderPath, path.join(DROPZONE_DIR, `_processed_${folderName}`));
    } catch (error) {
        console.error("Error uploading to Firestore:", error);
    }
}

async function main() {
    if (!fs.existsSync(DROPZONE_DIR)) {
        console.log("Dropzone directory not found. Creating...");
        fs.mkdirSync(DROPZONE_DIR);
    }

    const items = fs.readdirSync(DROPZONE_DIR);
    for (const item of items) {
        if (!item.startsWith('_processed_')) {
            await processFolder(item);
        }
    }
    console.log("Scan complete.");
    process.exit(0);
}

main();
