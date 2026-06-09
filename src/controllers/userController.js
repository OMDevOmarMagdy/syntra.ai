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

exports.addFinishedSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill } = req.body;

    if (!skill || typeof skill !== 'string' || skill.trim() === '') {
      return res.status(400).json({ error: 'Skill name is required and must be a non-empty string' });
    }

    const cleanedSkill = skill.trim();

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let updatedSkills = user.skills || [];
    if (!updatedSkills.includes(cleanedSkill)) {
      updatedSkills = [...updatedSkills, cleanedSkill];
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          skills: updatedSkills
        }
      });

      const secureUser = { ...updatedUser };
      delete secureUser.password;
      delete secureUser.resetPasswordToken;
      delete secureUser.resetPasswordExpires;
      delete secureUser.verificationToken;
      delete secureUser.verificationTokenExpires;

      return res.status(200).json({
        success: true,
        message: 'Skill added successfully',
        skills: updatedUser.skills,
        user: secureUser
      });
    }

    const secureUser = { ...user };
    delete secureUser.password;
    delete secureUser.resetPasswordToken;
    delete secureUser.resetPasswordExpires;
    delete secureUser.verificationToken;
    delete secureUser.verificationTokenExpires;

    return res.status(200).json({
      success: true,
      message: 'Skill already added',
      skills: user.skills,
      user: secureUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const secureUser = { ...user };
    delete secureUser.password;
    delete secureUser.resetPasswordToken;
    delete secureUser.resetPasswordExpires;
    delete secureUser.verificationToken;
    delete secureUser.verificationTokenExpires;

    res.status(200).json({
      success: true,
      user: secureUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

exports.finishTrack = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        trackFinished: true
      }
    });

    const secureUser = { ...user };
    delete secureUser.password;
    delete secureUser.resetPasswordToken;
    delete secureUser.resetPasswordExpires;
    delete secureUser.verificationToken;
    delete secureUser.verificationTokenExpires;

    res.status(200).json({
      success: true,
      message: 'Track marked as finished successfully',
      user: secureUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark track as finished' });
  }
};

exports.getFinishedUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        trackFinished: true
      }
    });

    const secureUsers = users.map(user => {
      const secureUser = { ...user };
      delete secureUser.password;
      delete secureUser.resetPasswordToken;
      delete secureUser.resetPasswordExpires;
      delete secureUser.verificationToken;
      delete secureUser.verificationTokenExpires;
      return secureUser;
    });

    res.status(200).json({
      success: true,
      count: secureUsers.length,
      users: secureUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve completed track users' });
  }
};