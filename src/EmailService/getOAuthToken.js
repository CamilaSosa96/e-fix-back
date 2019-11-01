const fs = require('fs')
const path = require('path')
const {google} = require('googleapis')

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
]

const CREDENTIALS_PATH = path.resolve(__dirname, '../EmailService/credentials.json')
const TOKEN_PATH = path.resolve(__dirname, '../EmailService/token.json')
let OAUTHCLIENT = null;

function getOAuthLink(routerCallback){
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) routerCallback(err, null)
    else authorize(JSON.parse(content), routerCallback)
  })
}

function authorize(credentials, routerCallback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0])
  getNewToken(oAuth2Client, routerCallback)
}

function getNewToken(oAuth2Client, routerCallback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  OAUTHCLIENT = oAuth2Client
  routerCallback(null, authUrl)
}

function sendOAuthCode(code, callback){
  OAUTHCLIENT.getToken(code, (err, token) => {
    if (err) callback(err)
    else {
      OAUTHCLIENT.setCredentials(token)
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) callback(err)
        else callback (null)
      })
    }
  })
}
    
module.exports = {getOAuthLink, sendOAuthCode}