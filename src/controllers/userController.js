const prisma = require('../config/prisma');
const cloudinary = require('../utils/cloudinary');

exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Convert buffer to base64
    const file = req.file;
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    // Get existing user to see if we need to delete an old photo from Cloudinary
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (existingUser?.imageId) {
      await cloudinary.uploader.destroy(existingUser.imageId);
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "profile_photos",
    });

    // Save to DB
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: result.secure_url,
        imageUrl: result.secure_url,
        imageId: result.public_id,
      },
    });

    // Return the updated fields securely
    res.json({
      message: "Profile photo updated successfully",
      user: {
        id: user.id,
        avatar: user.avatar,
        imageUrl: user.imageUrl,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
}