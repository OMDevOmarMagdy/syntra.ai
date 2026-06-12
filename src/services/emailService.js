// Email service for sending password reset emails
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// HTML email template
const htmlOtpForm = (userName, otp) => {
  return `
        <h2>Password Reset OTP</h2>
        <p>Hi ${userName},</p>
        <p>You requested a password reset. Use the following One-Time Password (OTP) to reset your password:</p>
        <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #007bff;">${otp}</span>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br>Syntra.AI Team</p>
        `;
};



// Send password reset OTP email
exports.sendPasswordResetOtpEmail = async (email, otp, userName) => {
  try {
    console.log('Reset OTP:', otp); // For debugging

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset OTP - Syntra.AI',
      html: htmlOtpForm(userName, otp),
    };

    console.log('Mail options: ', mailOptions);

    await sgMail.send(mailOptions);
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    if (err.response) {
      console.error('SendGrid error details:', JSON.stringify(err.response.body, null, 2));
    }
    throw new Error('Failed to send email');
  }
};

//  Verify email 
exports.sendVerificationEmail = async (email, verificationToken, userName) => {
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

    await sgMail.send(mailOptions);
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    
    if (err.response) {
      console.error('SendGrid error details:', JSON.stringify(err.response.body, null, 2));
    }
    throw new Error('Failed to send email');
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

    await sgMail.send(mailOptions);
    return true;
  } catch (err) { 
    console.error('Email send error:', err);
    if (err.response) {
      console.error('SendGrid error details:', JSON.stringify(err.response.body, null, 2));
    }
    throw new Error('Failed to send email');
  }
};
