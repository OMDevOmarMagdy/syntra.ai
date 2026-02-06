const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [
        function () {
          return !this.githubId;
        },
        'Please provide a password',
      ],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
        },
        message: 'Password must contain uppercase, lowercase, and numbers',
      },
    },
    resetPasswordToken: {
      type: String,
      select: false,
      description: 'Token for password reset',
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
      description: 'Expiration time for reset token',
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
      description: 'GitHub OAuth ID',
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: ['learner', 'team', 'employer', 'admin'],
        message: 'Role must be either learner, teamLead, employer, or admin',
      },
      default: 'learner',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS, 10) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);