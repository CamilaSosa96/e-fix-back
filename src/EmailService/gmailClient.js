const fs = require('fs')
const path = require('path')
const {google} = require('googleapis')

const CREDENTIALS_PATH = path.resolve(__dirname, '../EmailService/credentials.json')
const TOKEN_PATH = path.resolve(__dirname, '../EmailService/token.json')

function getGmailClient() {
    const credentials = fs.readFileSync(CREDENTIALS_PATH)
    const token = fs.readFileSync(TOKEN_PATH)
    const oauthClient = getOAuthClient(makeCredentials(credentials, token))
    return google.gmail({version: 'v1', auth: oauthClient})
}

function makeCredentials(credentials, token) {
    return {
        params: JSON.parse(credentials).installed,
        token: JSON.parse(token),
    };
}

function getOAuthClient(credentials) {
    oAuth2Client = new google.auth.OAuth2(
        credentials.params.client_id,
        credentials.params.client_secret,
        credentials.params.redirect_uris[0]
    );
    oAuth2Client.setCredentials(credentials.token)
    return oAuth2Client
}
  
module.exports = getGmailClient