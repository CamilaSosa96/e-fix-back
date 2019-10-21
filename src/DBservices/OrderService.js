const db = require('./MySQLconnection')

function saveOrder(user, clientName, clientDNI, clientEmail, productType, productBrand, productModel, problem, callback){
    query = `INSERT INTO ordenes (usuario_tecnico, nombre_cliente, dni_cliente, email_cliente, tipo_producto, 
            marca_producto, modelo_producto, problema_inicial, estado_producto)
            VALUES ('${user}', '${clientName}', '${clientDNI}', '${clientEmail}', '${productType}', '${productBrand}', 
            '${productModel}', '${problem}', 'RECIBIDO')`
    db.query(query, (err, result) => {
        if(err) console.log(err)
        callback(result)
    });
}

function getAllOrders(callback){
    query = 'SELECT * FROM ordenes'
    db.query(query, (err, result) => {
        if(err) console.log(err)
        result.forEach((elem) => {
            elem.fecha_actualizacion = elem.fecha_actualizacion.toLocaleString({timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone})
        })
        callback(result)
    })  
}

function updateState(id, state, callback){
    query = `UPDATE ordenes SET estado_producto='${state}' WHERE id='${id}'`
    db.query(query, (err, result) => {
        if(err) console.log(err)
        callback(result)
    })
}

function loadBudget(id, diagnosis, budget, callback){
    query = `UPDATE ordenes SET estado_producto='ESPERANDO_PRESUPUESTO', diagnostico='${diagnosis}',
            presupuesto='${budget}' WHERE id='${id}'`
    db.query(query, (err, result) => {
        if(err) console.log(err)
        callback(result)
    })
}

function searchOrderByEmail(string, callback){
    query = `SELECT * FROM ordenes WHERE email_cliente LIKE '%${string}%'`
    db.query(query, (err, result) => {
        if(err) console.log(err)
        result.forEach((elem) => {
            elem.fecha_actualizacion = elem.fecha_actualizacion.toLocaleString({timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone})
        })
        callback(result)
    })
}

function getOrderById(id, dni, callback){
    query = `SELECT * FROM ordenes WHERE id='${id}' AND dni_cliente='${dni}'`
    db.query(query, (err, result) => {
        if(err) console.log(err)
        result.forEach((elem) => {
            elem.fecha_actualizacion = elem.fecha_actualizacion.toLocaleString({timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone})
        })
        callback(result)
    })
}

module.exports = {saveOrder, getAllOrders, updateState, searchOrderByEmail, loadBudget, getOrderById}