const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

// In-memory logs storage
let logData = null;

// Set up Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    // Store the log in memory
    logData = {
      event: "AUTH GRANT",
      accessToken: accessToken,
      profile: profile,
    };
    
    if (!profile) {
      return done(new Error('No profile found'), null);
    }
    return done(null, profile);
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Auth request
router.get('/google', (req, res, next) => {
  // Store the AUTH REQUEST log in memory
  logData = {
    event: "AUTH REQUEST",
    requestURL: req.originalUrl,
  };
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});

// Auth callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, async (err, user, info) => {
    if (err) {
      logData = {
        event: "AUTH ERROR",
        error: err.message,
      };
      return res.redirect('/');
    }
    if (!user) {
      logData = {
        event: "AUTH FAILURE",
        info: info,
      };
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        logData = {
          event: "LOGIN ERROR",
          error: err.message,
        };
        return res.redirect('/');
      }
      logData = {
        event: "LOGIN SUCCESS",
        user: user,
      };
      res.redirect('/protected');
    });
  })(req, res, next);
});

module.exports = { router, logData };
