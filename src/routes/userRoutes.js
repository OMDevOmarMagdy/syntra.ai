const express = require("express");
const upload = require("../middleware/upload.js");
const { uploadProfilePhoto, addFinishedSkill, getUserProfile, finishTrack, getFinishedUsers } = require("../controllers/userController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Apply 'protect' to ensure the user is authenticated, then upload file, then process it
router.post("/upload-profile-photo", protect, upload.single("image"), uploadProfilePhoto);

// Skills and profile routes
router.post("/skills", protect, addFinishedSkill);
router.get("/profile", protect, getUserProfile);

// Track completion routes
router.post("/finish-track", protect, finishTrack);
router.get("/finished-tracks", protect, authorize("recruiter", "admin", "team"), getFinishedUsers);

module.exports = router;