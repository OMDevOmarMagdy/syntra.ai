// Initialize passport GitHub strategy

const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./prisma');

module.exports = function (passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/github/callback`,
        userProfileURL: 'https://api.github.com/user',
        scope: ['user:email'], // Request email scope
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Get primary email from profile.emails array
          let email = null;

          if (profile.emails && profile.emails.length > 0) {
            // Find primary email or use first email
            const primaryEmail = profile.emails.find((e) => e.primary) || profile.emails[0];
            email = primaryEmail ? primaryEmail.value : null;
          }

          // If email still not found, generate placeholder
          if (!email) {
            email = `${profile.username}@github.noemail`;
          }

          let user = null;

          // Try find by githubId first
          if (profile.id) {
            user = await prisma.user.findUnique({ where: { githubId: profile.id } });
          }

          // If not found, try by email (in case existing local account)
          if (!user && email && !email.includes('noemail')) {
            user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
          }

          if (user) {
            // Update user info if needed
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                githubId: user.githubId || profile.id,
                avatar: (profile._json && profile._json.avatar_url) || user.avatar,
                emailVerified: email && !email.includes('noemail') ? true : user.emailVerified,
              }
            });
            return done(null, user);
          }

          // Create new user
          const newUser = await prisma.user.create({
            data: {
              name: profile.displayName || profile.username || 'GitHub User',
              email: email.toLowerCase(),
              githubId: profile.id,
              avatar: (profile._json && profile._json.avatar_url) || null,
              emailVerified: email && !email.includes('noemail') ? true : false,
            }
          });

          return done(null, newUser);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Initialize passport Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Get primary email
          let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

          if (!email) {
            email = `${profile.id}@google.noemail`;
          }

          let user = null;

          // Try find by googleId first
          if (profile.id) {
            user = await prisma.user.findUnique({ where: { googleId: profile.id } });
          }

          // If not found, try by email
          if (!user && email && !email.includes('noemail')) {
            user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
          }

          if (user) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: user.googleId || profile.id,
                avatar: (profile.photos && profile.photos.length > 0) ? profile.photos[0].value : user.avatar,
                emailVerified: email && !email.includes('noemail') ? true : user.emailVerified,
              }
            });
            return done(null, user);
          }

          // Create new user
          const newUser = await prisma.user.create({
            data: {
              name: profile.displayName || 'Google User',
              email: email.toLowerCase(),
              googleId: profile.id,
              avatar: (profile.photos && profile.photos.length > 0) ? profile.photos[0].value : null,
              emailVerified: email && !email.includes('noemail') ? true : false,
            }
          });

          return done(null, newUser);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Serialize and deserialize user for session
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user || null);
    } catch (err) {
      done(err, null);
    }
  });
};
