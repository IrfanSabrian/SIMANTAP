const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Setup Cloudinary storage
let storage, uploadSingle, uploadMultiple;

try {
  console.log("Setting up Cloudinary storage for upload routes...");

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folder = req.body.folder || "uploads";
      const slug = req.body.slug || "default";
      return {
        folder: `${process.env.CLOUDINARY_FOLDER || "SIMANTAP"}/${folder}/${slug}`,
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [{ width: 1200, height: 1200, crop: "limit" }],
      };
    },
  });

  uploadSingle = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  });

  uploadMultiple = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 20 }, // 10MB limit per file, max 20 files
  });

  console.log("✅ Cloudinary storage configured successfully for upload routes");
} catch (error) {
  console.error("❌ Error setting up Cloudinary storage:", error);
  // Fallback to memory storage if Cloudinary fails
  uploadSingle = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  });
  uploadMultiple = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 20 },
  });
  console.log("⚠️  Using memory storage as fallback");
}

// POST /api/upload/image - Upload single image
router.post("/image", uploadSingle.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file provided",
      });
    }

    res.json({
      success: true,
      data: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to upload image",
    });
  }
});

// POST /api/upload/images - Upload multiple images
router.post("/images", uploadMultiple.array("images", 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No image files provided",
      });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    res.json({
      success: true,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to upload images",
    });
  }
});

module.exports = router;

