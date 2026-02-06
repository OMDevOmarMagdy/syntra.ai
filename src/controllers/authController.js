const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
} = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, msg = '') => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000), // Default 30 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
    message: msg
  });
};

// Validate password strength
const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters` };
  }
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { valid: false, message: 'Password must contain uppercase, lowercase, and numbers' };
  }
  return { valid: true };
};

// User Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    if (!role) return res.status(400).json({ error: 'Role is required' });

    // This is the roles that i can accept it from the body
    // So ( if someone writes admin it will reject )
    const allowedRoles = ['learner', 'team', 'employer'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Generate a verification token 
    const verificationToken = crypto.randomBytes(32).toString("hex"); 
    const verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest('hex'); 
    const verificationTokenExpires = Date.now() + 3600000; // 1 hour

    // Create user
    const user = await User.create({ name, email, password, role, verificationToken: verificationTokenHash, verificationTokenExpires });

    //  Send verification email 
    try {
      await sendVerificationEmail(user.email, verificationToken, user.name, res);
    } catch (error) { 
      res.status(500).json({ error: error.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const verificationTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      verificationToken: verificationTokenHash,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    sendTokenResponse(user, 200, res, 'Email verified successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout user
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
    message: 'Logged out successfully',
  });
};

// Get current logged-in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password - Send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry (1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (emailErr) {
      // Clear reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to email',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset Password - Verify token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, passwordConfirm } = req.body;

    // Validate input
    if (!token || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'Token, password, and confirm password are required' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Hash token to match stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send success email
    try {
      await sendPasswordResetSuccessEmail(user.email, user.name);
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr);
      // Don't fail the request if confirmation email fails
    }

    // Generate new JWT
    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
