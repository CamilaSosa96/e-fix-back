const db = require('./MySQLconnection');

function saveOrder(clientName, clientDNI, clientEmail, productType, productBrand, productModel, problem, callback){
    query = `INSERT INTO ordenes (nombre_cliente, dni_cliente, email_cliente, tipo_producto, 
            marca_producto, modelo_producto, problema_inicial, estado_producto, fecha_actualizacion)
            VALUES ('${clientName}', '${clientDNI}', '${clientEmail}', '${productType}', '${productBrand}', 
            '${productModel}', '${problem}', 'RECIBIDO', 
            '${new Date().toLocaleString({timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone})}')`
    db.query(query, (err, result) => {
        if(err) console.log(err);
        callback(result)
    });
}

function getAllOrders(callback){
    query = "SELECT * FROM ordenes"
    db.query(query, (err, result) => {
        if(err) console.log(err)
        result.forEach((elem)=>{
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

module.exports = {saveOrder, getAllOrders, updateState}