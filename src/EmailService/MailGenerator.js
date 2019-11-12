const settingsService = require('../DBservices/SettingsService')

function firstEmail(email, name, type, brand, model, callback){
  settingsService.getSettings((result) => {
    info = result[0]
    msg =  `Hola ${name}, 
            recibimos tu ${type} ${brand} ${model}, se te notificará por este medio ante cualquier novedad sobre el mismo.`
            .concat(contactInfoGenerator(info))
    callback({
      send: result[0].RECIBIDO,
      clientName: name,
      clientAddress: email,
      subject: `Recibimos tu producto!`,
      message: msg
    })
  })
}

function contactInfoGenerator(info){
  return(
    info.email !== '' && info.telefono !== '' ? 
    `Ante cualquier inquietud puede enviarnos un correo a ${info.email} o llamar al ${info.telefono}` : '') 
    .concat(info.email === '' && info.telefono !== ''? '' : ` Ante cualquier inquietud puede enviarnos un correo a ${info.email}.`)
    .concat(info.telefono === '' && info.email !== '' ? '' : ` Ante cualquier inquietud puede llamarnos al ${info.telefono}.`)
    .concat(info.nombre === '' ? '' : ` Gracias por confiar en nosotros, saludos, ${info.nombre}.`
  )
}

module.exports = {firstEmail}