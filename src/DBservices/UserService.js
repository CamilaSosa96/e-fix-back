const db = require('./MySQLconnection')
const sha1 = require('sha1');

function authUser(username, password, callback){
    pass = sha1(password)
    query = `SELECT * FROM usuarios WHERE usuario='${username}' AND contraseña='${pass}'`
    db.query(query, (err, result) => {
        if(err) console.log(err)
        callback(result[0])
    });
}

function createUser(username, password, callback){
    query = `INSERT INTO usuarios (usuario, contraseña) VALUES ('${username}', SHA1('${password}'))`
    db.query(query, (err, _result) => {
        if(err) console.log(err)
        callback(err)
    })
}

module.exports = {authUser, createUser};