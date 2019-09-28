const db = require('./MySQLconnection');

function saveOrder(clientName, clientDNI, clientEmail, productType, productBrand, productModel, problem, callback){
    query = `INSERT INTO ordenes (nombre_cliente, dni_cliente, email_cliente, tipo_producto, 
            marca_producto, modelo_producto, problema_inicial, estado_producto, fecha_actualizacion)
            VALUES ('${clientName}', '${clientDNI}', '${clientEmail}', '${productType}', '${productBrand}', 
            '${productModel}', '${problem}', 'RECIBIDO', '${new Date().toLocaleString()}')`
    db.query(query, (err, result) => {
        if(err) console.log(err);
        callback(result)
    });
}

module.exports = {saveOrder}