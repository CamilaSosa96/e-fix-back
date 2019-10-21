const db = require('./MySQLconnection')

function authUser(username, password, callback){
    query = `SELECT * FROM usuarios WHERE usuario='${username}' AND contraseña='${password}'`
    db.query(query, (err, result) => {
        if(err) console.log(err)
        callback(result[0])
    });
}

function createUser(username, password, callback){
    query = `INSERT INTO usuarios (usuario, contraseña) VALUES ('${username}', '${password}')`
    db.query(query, (err, _result) => {
        if(err) console.log(err)
        callback(err)
    })
}

module.exports = {authUser, createUser};