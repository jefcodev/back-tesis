const { Router } = require("express");
const checkAuth = require("../middleware/auth")
const checkRoleAuth = require("../middleware/rol")
const { getClientes, getGuardias, getPedidos, getUsuarios, getDespachos, getPrestamos, getInsumos, postCreateClientes, postCreateGuardias,
    postCreatePedidos, postCreateInsumos, postCreatePrestamos, postCreateDespachos, putUpdateClientes, putUpdateGuardias, putUpdatePedidos, putUpdateDespachos,
    putUpdatePrestamos, putUpdateInsumos, getAutoridades, putUpdateAutoridades, postCreateAutoridades, getTinas, getDevolucion, getCompras, getReciclados,
    postCreateReciclados, getBitacorabyClientandAyudante, putUpdateReciclados, getPrestamos2, postCreateDevolucion, putUpdateDevolucion, postCreateCompras, putUpdateCompras, getClientesCount, getPedidosCount, getCountPrestamos, getBitacora, postCreateBitacora } = require("../controller/insumos.controller");




const router = Router()

router.get("/usuarios", getUsuarios)

// Clientes
router.get("/clientes",  getClientes)
router.get("/clientesCount",  getClientesCount)
router.post("/clientes",  postCreateClientes)
router.put("/clientes",  putUpdateClientes)


//Autoridades


router.get("/autoridades",  getAutoridades)
router.post("/autoridades",  postCreateAutoridades)
router.put("/autoridades",  putUpdateAutoridades)


//Guardias
router.get("/guardias",  getGuardias)
router.post("/guardias",  postCreateGuardias)
router.put("/guardias",  putUpdateGuardias)


//Pedidos
router.get("/pedidos",  getPedidos)
router.get("/pedidosCount",  getPedidosCount)
router.post("/pedidos",  postCreatePedidos)
router.put("/pedidos",  putUpdatePedidos)


//Despachos 
router.get("/despachos",  getDespachos)
router.post("/despachos",  postCreateDespachos)
router.put("/despachos",  putUpdateDespachos)


// Prestamo tinas
router.get("/prestamos",  getPrestamos)
router.get("/prestamosCount",  getCountPrestamos)
router.get("/prestamoss",  getPrestamos2)

router.post("/prestamos",  postCreatePrestamos)
router.put("/prestamos",  putUpdatePrestamos)

// Ingreso Insumos 
router.get("/insumos",  getInsumos)
router.post("/insumos",  postCreateInsumos)
router.put("/insumos",  putUpdateInsumos)


//Tinas

router.get("/tinas",  getTinas)

// Compras

router.get("/compras",  getCompras)
router.post("/compras",  postCreateCompras)
router.put("/compras",  putUpdateCompras)

//Reciclados

router.get("/recicladas",  getReciclados)
router.post("/recicladas",  postCreateReciclados)
router.put("/recicladas",  putUpdateReciclados)

// Devoluciones

router.get("/devoluciones",  checkAuth, checkRoleAuth(['Administrador']), getDevolucion)
router.post("/devoluciones", checkAuth, checkRoleAuth(['Administrador']), postCreateDevolucion)
router.put("/devoluciones", checkAuth, checkRoleAuth(['Administrador']), putUpdateDevolucion)

//Bitacoras

router.get("/bitacora",  getBitacora)
router.post("/bitacora",  postCreateBitacora)
router.get("/bit",  getBitacorabyClientandAyudante)


module.exports = router

