const getGmailClient = require('./gmailClient')

function sendMail(emailInfo, callback){
  if(emailInfo.send){
    try {
      const gmailClient = getGmailClient()
      gmailClient.users.messages.send(
        {
          userId: 'me',
          requestBody: {
            raw: createMessage(emailInfo),
          }
        }
      )
      callback(null)
    } catch (e) {callback(e)}
  } else callback(null)
}

function createMessage(emailInfo) {
  const clientName = emailInfo.clientName
  const clientAddress = emailInfo.clientAddress
  const subject = emailInfo.subject
  const message = emailInfo.message
  const messageParts = [
    `To: ${clientName} <${clientAddress}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    `${message}`,
  ]
  const myMessage = messageParts.join('\n')
  
  const encodedMessage = Buffer.from(myMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  
  return encodedMessage
}

module.exports = {sendMail}