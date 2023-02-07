const { db } = require("../cnn")
const { encrypt } = require("../Helpers/handleBcrypt")



const createUsuario = async (request, response) => {

    const { tipo_usuario, nombre_usuario, clave_usuario } = request.body
    const password = await encrypt(clave_usuario);
    console.log(tipo_usuario, nombre_usuario, clave_usuario, password)
    const res = await db.any('INSERT INTO tbl_usuario (id_usuario ,tipo_usuario, nombre_usuario, clave_usuario ) VALUES ($1, $2, $3,$4)'
        , [91, tipo_usuario, nombre_usuario, password])
    response.status(201).send(`{"status":"Ok", "resp":"Correcto "}`)

}

module.exports = {
    createUsuario
}