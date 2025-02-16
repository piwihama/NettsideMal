const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const app = express();
const port = 5000;

// CORS-konfigurasjon
const corsOptions = {
  origin: [
    "https://www.rimeligauksjon.no",
    "http://localhost:8081",
    "https://rimelig-auksjon-backend.vercel.app",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Konfigurer multer for å håndtere opplastede filer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Øker maks filstørrelse til 50MB per fil
});

// Konfigurer S3-klienten
const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIAR4M65FGP76COT3D6", // Dine faktiske AWS-nøkler
    secretAccessKey: "lk86nZYLS3iNAbgH3OnQfju+kw6cvTdtC8k/+q7I",
  },
});



// Middleware for logging av requests
// Middleware for logging av requests
app.use((req, res, next) => {
  console.log("🔥 New Request:", req.method, req.url);
  console.log("Headers:", req.headers);

  if (req.method === "POST") {
    let rawData = [];
    
    req.on('data', chunk => {
      rawData.push(chunk);
    });

    req.on('end', () => {
      console.log("📦 Raw Request Body:", Buffer.concat(rawData).toString());
    });
  }

  next();
});


// Funksjon for å laste opp bilde til S3
async function uploadImageToS3(imageBuffer) {
  const uniqueImageName = `${uuidv4()}.jpg`;
  const params = {
    Bucket: "rimeligauksjon2024",
    Key: `auctions/${uniqueImageName}`,
    Body: imageBuffer,
    ContentType: "image/jpeg",  
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log(`✅ Upload successful: ${params.Key}`);
    return `https://${params.Bucket}.s3.eu-north-1.amazonaws.com/${params.Key}`;
  } catch (err) {
    console.error("❌ Error uploading to S3:", err);
    throw new Error(`Failed to upload file: ${err.message}`);
  }
}

// Endepunkt for bildeopplasting
app.post("/upload", upload.array("images"), async (req, res) => {
  try {
    console.log("🔥 Mottar bildeopplastingsforespørsel...");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("📸 Files received:", req.files ? req.files.length : 0);

    if (!req.files || req.files.length === 0) {
      console.log("❌ Ingen filer mottatt!");
      return res.status(400).json({ message: "Ingen filer mottatt. Sjekk at FormData blir riktig sendt fra frontend." });
    }

    req.files.forEach((file, index) => {
      console.log(`🔍 Fil ${index + 1}:`, {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
    });

    const imageUploadPromises = req.files.map(async (file) => {
      console.log("⏳ Optimaliserer:", file.originalname);
      const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 1024 })
        .jpeg({ quality: 80 })
        .toBuffer();

      return await uploadImageToS3(optimizedBuffer);
    });

    const imageUrls = await Promise.all(imageUploadPromises);
    res.status(200).json({ imageUrls });
  } catch (err) {
    console.error("❌ Feil ved bildeopplasting:", err.message);
    res.status(500).json({ message: "Kunne ikke laste opp bilder", error: err.message });
  }
});


// Start serveren
app.listen(port, () => {
  console.log(`🚀 File upload service running on port ${port}`);
});
