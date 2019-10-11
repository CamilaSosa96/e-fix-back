const db = require('./MySQLconnection')

function authUser(username, password, callback){
    query = `SELECT * FROM usuarios WHERE usuario='${username}' AND contraseña='${password}'`
    db.query(query, (err, result) => {
        if(err) console.log(err)
        callback(result[0])
    });
}

module.exports = {authUser};