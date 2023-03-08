const { OAuth2Client } = require('google-auth-library');
const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    "620258892888-72q3mc2khbsl1gnvec8qcekpp94t6ijm.apps.googleusercontent.com",
    "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",
    "http://localhost:8080/auth/google/callback",
);

const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

const {tokens} = await oauth2Client.getToken(code)
oauth2Client.setCredentials(tokens);