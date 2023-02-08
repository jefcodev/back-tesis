const { Router } = require("express");
const { createUsuario, postCreateClientes } = require("../controller/usuario");
const { loginCtrl, getUSer } = require("../controller/auth");




const router = Router()


router.post("/usuario", createUsuario)
router.post("/login", loginCtrl)
router.post("/user/:token", getUSer)


module.exports = router

