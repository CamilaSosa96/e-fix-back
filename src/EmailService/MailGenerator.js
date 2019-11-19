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

function sendBudgetMail(id, baseurl, callback){
  settingsService.getSettings((result) => {
    settings = result[0]
    orderService.getOrder(id, (order) => {
      msg = `Hola ${order.nombre_cliente}, 
      tu producto ha sido revisado y diagnosticado, ingresá al siguiente link para ver 
      el diagnóstico de tu producto, y confirmar si querés continuar con el proceso de reparación: 
      ${baseurl}/budget/${order.id}/${order.dni_cliente} .` 
      .concat(contactInfoGenerator(settings))
      callback({
        send: Reflect.get(settings, order.estado_producto),
        clientName: order.nombre_cliente,
        clientAddress: order.email_cliente,
        subject: `Presupuesto para reparar tu ${order.marca_producto} ${order.modelo_producto}`,
        message: msg
      })
    })
  })
}

function contactInfoGenerator(info){
  return(
    info.email !== '' && info.telefono !== '' ? ` Ante cualquier inquietud podés enviarnos un correo a ${info.email} o llamar al ${info.telefono}.` : '') 
    .concat(info.email !== '' && info.telefono === ''? ` Ante cualquier inquietud podés enviarnos un correo a ${info.email}.` : '')
    .concat(info.telefono !== '' && info.email === '' ? ` Ante cualquier inquietud podés llamarnos al ${info.telefono}.` : '')
    .concat(info.nombre === '' ? '' : ` Gracias por confiar en nosotros, saludos, ${info.nombre}.`
  )
}

function stateInfoGenerator(state){
  switch(state){
    case 'RECIBIDO' : return 'recibimos tu producto, se te notificará por este medio ante cualquier novedad sobre el mismo.'
    case 'REPARACION' : return 'tu producto se encuentra en proceso de reparación. Se te notificará cuando termine el mismo.'
    case 'RETIRAR_SINARREGLO' : return 'tu producto se encuentra listo para ser retirado sin reparación. Esperamos tu visita para que lo retires.'
    case 'REPARADO' : return 'tu producto ya se encuentra reparado. Esperamos tu visita para que abones la reparación y retires el producto.'
    case 'CANCELADA' : return 'tu producto ha sido retirado sin reparar. No se ha aprobado la reparación y esta ha sido cancelada.'
    case 'ENTREGADO' : return 'tu producto ha sido reparado. La reparación fue abonada y el producto retirado.'
    default : return ''
  }
}

module.exports = {firstEmail, stateUpdateMail, sendBudgetMail}