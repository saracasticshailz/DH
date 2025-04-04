import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-saml';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Path to the certificate
const certPath = path.join(__dirname, '../certificates', 'azure-saml.pem');
console.log('certPath:', certPath);

// Read certificate if it exists
let samlCert = '';

if (fs.existsSync(certPath)) {
  samlCert = fs.readFileSync(certPath, 'utf-8');
} else {
  console.error('SAML certificate file not found at:', certPath);
  // Exit if the certificate is not found (optional based on your use case)
  process.exit(1);
}

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(passport.initialize());

// Frontend URL to redirect to after authentication
const FRONTEND_URL = 'http://localhost:3000/RmDashboard';

// Set a default callback URL if not provided in environment variables
const callbackUrl = process.env.SAML_CALLBACK_URL || 'http://localhost:3000/RmDashboard';

// SAML Strategy setup
const samlStrategy = new Strategy(
  {
    entryPoint:
      process.env.SAML_ENTRY_POINT || 'https://login.microsoftonline.com/6171e1a1-b822-451c-b9bb-e6e35d88b0db/saml2',
    issuer: process.env.SAML_ISSUER || 'https://adcb.gandalf.tech/saml2/bayut/metadata',
    callbackUrl: callbackUrl,
    cert: samlCert, // Pass the certificate here
  },
  (profile, done) => {
    return done(null, profile);
  }
);

passport.use(samlStrategy);

// Route to initiate SAML authentication
router.get('/test-saml', (req, res) => {
  passport.authenticate('saml')(req, res, () => {
    console.log('SAML authentication initiated');
  });
});

// SAML response handling
router.post('/RmDashboard', (req, res) => {
  console.log('=== RAW SAML RESPONSE ===');
  console.log(req.body.SAMLResponse);

  if (req.body.SAMLResponse) {
    const decodedSAML = Buffer.from(req.body.SAMLResponse, 'base64').toString('utf-8');
    console.log('\n=== DECODED SAML RESPONSE ===');
    console.log(decodedSAML);

    // Optionally save the decoded SAML response to a file for debugging purposes
    fs.writeFileSync('saml-response.xml', decodedSAML);
    console.log('\nSAML response saved to saml-response.xml');
  }

  // Continue with passport authentication
  passport.authenticate('saml', (err, user) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).send('Authentication failed');
    }

    if (!user) {
      return res.status(401).send('User not authenticated');
    }

    console.log('\n=== PARSED USER PROFILE ===');
    console.log(JSON.stringify(user, null, 2));

    // Extract email from the user profile
    const email = user.email;

    console.log(`Extracted email: ${email}`);

    // Check if this is a development environment or if a debug parameter is present
    const isDebug = process.env.NODE_ENV === 'development' && req.query.debug === 'true';

    if (isDebug) {
      // In debug mode, show the SAML response details
      return res.send(`
        <html>
          <head>
            <title>SAML Authentication Result</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; }
              .button { 
                display: inline-block; 
                background: #4CAF50; 
                color: white; 
                padding: 10px 20px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin-top: 20px; 
              }
            </style>
          </head>
          <body>
            <h1>Authentication Successful</h1>
            <h2>Extracted Email: ${email}</h2>
            <a href="${FRONTEND_URL}?email=${encodeURIComponent(email)}" class="button">
              Continue to RmDashboard
            </a>
            <h2>User Profile:</h2>
            <pre>${JSON.stringify(user, null, 2)}</pre>
            <h2>Raw SAML Response:</h2>
            <textarea rows="10" cols="100">${req.body.SAMLResponse}</textarea>
            <h2>Decoded SAML Response:</h2>
            <textarea rows="20" cols="100">${Buffer.from(req.body.SAMLResponse, 'base64').toString('utf-8')}</textarea>
          </body>
        </html>
      `);
    } else {
      // In production mode, redirect to the frontend with the email
      return res.redirect(`${FRONTEND_URL}?email=${encodeURIComponent(email)}`);
    }
  })(req, res);
});

export default router;
