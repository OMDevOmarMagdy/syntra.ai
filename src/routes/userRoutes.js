const express = require("express");
const upload = require("../middleware/upload.js");
const { uploadProfilePhoto } = require("../controllers/userController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Apply 'protect' to ensure the user is authenticated, then upload file, then process it
router.post("/upload-profile-photo", protect, upload.single("image"), uploadProfilePhoto);

module.exports = router;