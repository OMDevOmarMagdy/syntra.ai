// Email service for sending password reset emails
const nodemailer = require('nodemailer');

// HTML email template
const htmlForm = (userName, resetUrl) => {
  return `
        <h2>Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br>Syntra.AI Team</p>
        `;
};

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetToken, userName, res) => {
  try {
    const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${resetToken}`;
    console.log('Reset URL:', resetUrl); // For debugging

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request - Syntra.AI',
      html: htmlForm(userName, resetUrl),
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};

//  Verify email 
exports.sendVerificationEmail = async (email, verificationToken, userName, res) => {
  try {
    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${verificationToken}`;
    console.log('Verification URL: ', verificationUrl); // For debugging

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email Address - Syntra.AI',
      html: `
        <h2>Verify Your Email Address</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for signing up to Syntra.AI. Please click the link below to verify your email address:</p>
        <p>
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Syntra.AI Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email send error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
  }
};

// Send password reset success email
exports.sendPasswordResetSuccessEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Changed Successfully - Syntra.AI',
      html: `
        <h2>Password Changed Successfully</h2>
        <p>Hi ${userName},</p>
        <p>Your password has been changed successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        <p>Best regards,<br>Syntra.AI Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Confirmation email sent' });
  } catch (err) { 
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
