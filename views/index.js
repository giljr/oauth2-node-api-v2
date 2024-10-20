// views/index.js
const express = require('express');
const router = express.Router();

// Render the home page
router.get('/', (req, res) => {
    res.render('home', { title: 'Home Page' });
});

// Render the login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' });
});

// Render the protected page
router.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('protected', { user: req.user });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
