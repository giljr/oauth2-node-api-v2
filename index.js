const express = require('express');
const session = require('express-session');
const passport = require('passport');
const fs = require('fs');
const path = require('path');
require('./auth'); // Ensure your auth.js file is correctly configured
require('dotenv').config();

const indexRoutes = require('./views/index');
const app = express();

// Set up view engine
app.set('view engine', 'ejs'); // or any other template engine
app.set('views', './views');

// Serve static files (like your client-side JS)
app.use(express.static(path.join(__dirname, 'views'))); // script.js and styles.css are inside the 'public' folder

// Middleware configuration
app.use(session({
    secret: 'cats', // Consider changing this to a more secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// In-memory log storage
const logs = [];
const logFilePath = path.join(__dirname, 'authLogs.json');

// Function to save logs to a JSON file
function saveLogToFile() {
    fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (writeErr) => {
        if (writeErr) {
            console.error('Error writing to log file:', writeErr);
        }
    });
}

// Function to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Define routes
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentication Example</title>             
        </head>
        <body>
            <h1>Welcome to the Authentication Example</h1>
            <a href="/auth/google">Authenticate with Google</a>
            <!-- Include your client-side JS file <script src="views/public/js/styles.css"></script>-->
        </body>
        </html>
    `);
});

app.get('/auth/google', (req, res, next) => {
    // Log the auth request
    const authRequestLog = {
        event: "AUTH REQUEST",
        requestURL: req.originalUrl,
        timestamp: new Date() // Adding timestamp for logging
    };

    // Store log data in memory
    logs.push(authRequestLog);

    // Redirect to Google for authentication
    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure'
    }, (err, user, info) => {
        if (err) {
            console.error('Authentication Error:', err);
            return res.redirect('/auth/google/failure');
        }
        if (!user) {
            return res.redirect('/auth/google/failure');
        }

        // Extract the authorization code
        const authorizationCode = req.query.code;

        // Log the AUTH GRANT event
        const authGrantLog = {
            event: "AUTH GRANT",
            userId: user.id,
            userEmail: user.emails[0].value,
            authorization_code: authorizationCode,  // Include the authorization code
            requestURL: req.originalUrl,
            timestamp: new Date()
        };

        // Store the AUTH GRANT log
        logs.push(authGrantLog);

        // Log in the user
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login Error:', err);
                return res.redirect('/auth/google/failure');
            }

            // At this point, the token exchange has occurred (handled by passport)
            const tokenExchangeLog = {
                event: "TOKEN_EXCHANGE",
                userId: user.id,
                userEmail: user.emails[0].value,
                requestURL: req.originalUrl,
                timestamp: new Date()  // Log the timestamp when the token is exchanged
            };

            // Store the TOKEN EXCHANGE log
            logs.push(tokenExchangeLog);

            // Redirect to protected page after logging in
            res.redirect('/protected');
        });
    })(req, res, next);
});


app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate...');
});

app.get('/protected', isLoggedIn, (req, res) => {
    // Prepare the HTML response
    const response = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Protected Resource</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .container {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    width: 90%;
                    max-width: 600px;
                    text-align: center;
                }
                h1 {
                    color: #333;
                }
                img {
                    border-radius: 50%;
                    width: 100px;
                    height: 100px;
                    margin-top: 10px;
                }
                .user-info {
                    margin-top: 20px;
                    text-align: left;
                }
                .user-info p {
                    margin: 5px 0;
                }
                a {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 15px;
                    background: #5cb85c;
                    color: white;
                    border-radius: 5px;
                    text-decoration: none;
                }
                a:hover {
                    background: #4cae4c;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome, ${req.user.displayName}!</h1>
                <img src="${req.user.photos[0].value}" alt="Profile Picture" />
                <div class="user-info">
                    <p><strong>Email:</strong> ${req.user.emails[0].value}</p>
                    <p><strong>User ID:</strong> ${req.user.id}</p>
                    <p><strong>First Name:</strong> ${req.user.name.givenName}</p>
                    <p><strong>Last Name:</strong> ${req.user.name.familyName}</p>
                    <p><strong>Provider:</strong> ${req.user.provider}</p>
                </div>
                <a href="/logout">Logout</a>
            </div>
        </body>
        </html>
    `;

    // Save logs to file after accessing the protected resource
    saveLogToFile();

    // Clear the logs after saving
    logs.length = 0; // Clear the log array

    res.send(response);
});

app.get('/logout', (req, res) => {
    // Check if the user is authenticated before attempting to log out
    if (req.isAuthenticated()) {
        req.logOut(); // Correct method call
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
            res.sendFile(path.join(__dirname, 'views', 'log_again.html'));
        });
    } else {
        res.sendFile(path.join(__dirname, 'views', 'log_again.html'));
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server listening on port 5000');
});
