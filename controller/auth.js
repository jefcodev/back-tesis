const { response } = require("express")
const { db } = require("../cnn")
const { compare } = require("../Helpers/handleBcrypt")
const { tokenSign } = require("../Helpers/generateToken")
const { decodeSign } = require("../Helpers/generateToken");

const loginCtrl = async (req, res) => {
    try {
        const { nombre_usuario, clave_usuario } = req.body

        const response = await db.any('select id_usuario, tipo_usuario, nombre_usuario, clave_usuario from tbl_usuario where nombre_usuario=$1', [nombre_usuario]);

        if (response == '') {

            res.status(200).send(`{"status":"Error", "resp":"Usuario no registrado"},"usuario":"${response[0].tipo_usuario}" `)
        } else {

            checkPassword = await compare(clave_usuario, response[0].clave_usuario);

            if (checkPassword) {

                const token = await tokenSign(response[0].id_usuario, response[0].tipo_usuario);

                // response.status.send(data)
                res.status(200).send(`{"status":"OK", "token":"${token}", "usuario":"${response[0].tipo_usuario}"}`)


            } else {
                res.status(200).send(`{"status":"Error", "resp":"Contaseña incorrecta"} `)
            }

        }


    } catch (error) {
        res.status(404).send(`{"status":"Error", "resp":"Error"}`)
    }
}
const getUSer = async (req, res) => {
    // const { token } = req.body
    const token = req.params.token;
    // console.log(token)
    const Rtoken = await decodeSign(token, null);
    // console.log("asdas")
    res.status(200).send(`{"id":"${Rtoken._id}", "rol":"${Rtoken.role}"}`)
   
    // res.status(200).send(Rtoken)

}



// const loginCtrl = async (req, res) => {
//     try {
//         const { nombre_usuario, clave_usuario } = req.body
//         console.log('asdasd')

//         db.query('select id_usuario, tipo_usuario, nombre_usuario, clave_usuario from tbl_usuario where nombre_usuario=$1', [nombre_usuario], async (error, results) => {

//             if (results.rows == '') {
//                 res.status(200).send(`{"status":"Error", "resp":"Usuario no registrado"}`)
//             } else {
//                 if (error) {
//                     res.status(404).send(`{"status":"Error", "resp":"Error"}`)
//                 } else {
//                     checkPassword = await compare(clave_usuario, results.rows[0].clave_usuario);
//                     if (checkPassword) {

//                         const token = await tokenSign(results.rows[0].id_usuario, results.rows[0].tipo_usuario);
//                         // response.status.send(data)
//                         res.status(200).send(`{"status":"OK", "token":"${token}"}`)

//                     } else {
//                         res.status(200).send(`{"status":"Error", "resp":"Contaseña incorrecta"}`)
//                     }
//                 }
//             }

//         })
//     } catch (error) {
//         res.status(404).send(`{"status":"Error", "resp":"Error"}`)
//     }
// }
module.exports = {
    loginCtrl, getUSer

}