const db = require('./MySQLconnection')

function saveSettings(settings, callback){
    query = `UPDATE preferencias SET nombre='${settings.name}', email='${settings.email}', 
            telefono='${settings.phone}', RECIBIDO=${settings.prefRecived}, 
            ESPERANDO_PRESUPUESTO=${settings.prefBudget}, REPARACION=${settings.prefRepairing},
            RETIRAR_SINARREGLO=${settings.prefTakeBackNoRepair}, REPARADO=${settings.prefRepaired},
            CANCELADA=${settings.prefTookBackNoRepair}, ENTREGADO=${settings.prefDelivered},
            email_auth=${settings.emailAuth}`
    db.query(query, (err, _result) => {
        if(err) console.log(err)
        callback()
    })
}

function saveEmailAuth(callback){
    query = 'UPDATE preferencias SET email_auth=true'
    db.query(query, (err, _result) => {
        if(err) console.log(err)
        callback()
    })
}

function getSettings(callback){
    query = 'SELECT * FROM preferencias'
    db.query(query, (err, result) => {
        if(err) console.log(err)
        callback(result)
    })
}

module.exports = {saveSettings, getSettings, saveEmailAuth}