const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/verify-email', verifyEmail); // Verify email before creating the user in the database

// Password management routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ======== GitHub OAuth: start ========
// Request user:email scope to get user's email address
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// ======== GitHub OAuth callback ========
router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/api/v1/auth/github/failure',
  }),
  (req, res) => {
    // Successful authentication. Issue JWT and redirect or respond.
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    });

    // Redirect to frontend with token (frontend should handle token in query)
    const frontend = process.env.APP_URL || 'http://localhost:3000';
    return res.redirect(`${frontend}/auth/success?token=${token}`);
  }
);

router.get('/github/failure', (req, res) => {
  res.status(401).json({ success: false, message: 'GitHub authentication failed' });
});
// ======== GitHub OAuth: end ========

// Protected route to get current user info
router.get('/me', protect, getMe);

module.exports = router;
