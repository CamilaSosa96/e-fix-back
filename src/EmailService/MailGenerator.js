const settingsService = require('../DBservices/SettingsService')
const orderService = require('../DBservices/OrderService')

function firstEmail(email, name, type, brand, model, callback){
  settingsService.getSettings((result) => {
    settings = result[0]
    msg =  `Hola ${name}, `
            .concat(stateInfoGenerator('RECIBIDO'))
            .concat(contactInfoGenerator(settings))
    callback({
      send: Reflect.get(settings, 'RECIBIDO'),
      clientName: name,
      clientAddress: email,
      subject: `Recibimos tu ${type} ${brand} ${model}!`,
      message: msg
    })
  })
}

function stateUpdateMail(id, callback){
  settingsService.getSettings((result) => {
    settings = result[0]
    orderService.getOrder(id, (order) => {
      msg = `Hola ${order.nombre_cliente}, ` 
      .concat(stateInfoGenerator(order.estado_producto))
      .concat(contactInfoGenerator(settings))
      callback({
        send: Reflect.get(settings, order.estado_producto),
        clientName: order.nombre_cliente,
        clientAddress: order.email_cliente,
        subject: `Novedades de tu ${order.marca_producto} ${order.modelo_producto}!`,
        message: msg
      })
    })
  })
}

function contactInfoGenerator(info){
  return(
    info.email !== '' && info.telefono !== '' ? ` Ante cualquier inquietud puede enviarnos un correo a ${info.email} o llamar al ${info.telefono}.` : '') 
    .concat(info.email !== '' && info.telefono === ''? ` Ante cualquier inquietud puede enviarnos un correo a ${info.email}.` : '')
    .concat(info.telefono !== '' && info.email === '' ? ` Ante cualquier inquietud puede llamarnos al ${info.telefono}.` : '')
    .concat(info.nombre === '' ? '' : ` Gracias por confiar en nosotros, saludos, ${info.nombre}.`
  )
}

function stateInfoGenerator(state){
  switch(state){
    case 'RECIBIDO' : return 'recibimos tu producto, se te notificará por este medio ante cualquier novedad sobre el mismo.'
    case 'REPARACION' : return 'su producto se encuentra en proceso de reparación. Se le notificará cuando termine el mismo.'
    case 'RETIRAR_SINARREGLO' : return 'su producto se encuentra listo para ser retirado sin reparación. Esperamos su visita para que lo retire.'
    case 'REPARADO' : return 'su producto ya se encuentra reparado. Esperamos su visita para que abone la reparación y retire el producto.'
    case 'CANCELADA' : return 'su producto ha sido retirado sin reparar. No se ha aprobado la reparación y esta ha sido cancelada.'
    case 'ENTREGADO' : return 'su producto ha sido reparado. La reparación fue abonada y el producto retirado.'
    default : return ''
  }
}

module.exports = {firstEmail, stateUpdateMail}