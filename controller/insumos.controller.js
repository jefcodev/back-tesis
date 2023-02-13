const { response } = require("express")

const { db } = require("../cnn")
const { encrypt } = require("../Helpers/handleBcrypt")

//

// Usuario

const getUsuarios = async (req, res) => {
    const response = await db.any('select * from tbl_usuario')
    res.json(response)
}


const postCreateUsuarios = async (req, res) => {
    const { tipo_usuario, nombre_usuario, clave_usuario } = req.body
    const password = await encrypt(clave_usuario);

    const response = await db.any(`INSERT INTO tbl_usuario ( tipo_usuario, nombre_usuario, clave_usuario) 
    values($1,$2,$3)`, [tipo_usuario, nombre_usuario, password])
    res.json({
        message: 'tbl_Usuario creada correctamente'
    })
}

const putUpdateUsuarios = async (req, res) => {
    const { id_usuario, tipo_usuario, nombre_usuario, clave_usuario } = req.body
    const password = await encrypt(clave_usuario);
    const response = await db.any(`UPDATE tbl_usuario set tipo_usuario=$2, nombre_usuario=$3, clave_usuario=$4 
    where id_usuario=$1`, [id_usuario, tipo_usuario, nombre_usuario, password])
    res.json({
        message: 'Usuario actualizado correctamente'
    })
}

// Clientes

const getClientes = async (req, res) => {
    const response = await db.any('select * from tbl_cliente')
    res.json(response)
}
const getClientesCount = async (req, res) => {
    const response = await db.any('SELECT count(cedula) as num_clients FROM tbl_cliente')
    res.json(response)
}

const postCreateClientes = async (req, res) => {
    const { cedula, nombre, apellido, ciudad, telefono } = req.body
    const response = await db.any(`INSERT INTO tbl_cliente (cedula, nombre, apellido, ciudad, telefono) 
    values($1,$2,$3,$4,$5)`, [cedula, nombre, apellido, ciudad, telefono])
    res.json({
        message: 'tbl_cliente creada correctamente'


    })
}

const putUpdateClientes = async (req, res) => {
    const { cedula, nombre, apellido, ciudad, telefono } = req.body
    const response = await db.any(`UPDATE tbl_cliente set nombre=$2, apellido=$3, ciudad=$4, telefono=$5 
    where cedula=$1`, [cedula, nombre, apellido, ciudad, telefono])
    res.json({
        message: 'Cliente actualizado correctamente'

    })
}

// Guardias
const getGuardias = async (req, res) => {
    const response = await db.any('select * from tbl_guardia')
    res.json(response)
}

const postCreateGuardias = async (req, res) => {
    const { cedula, nombre, apellido, telefono, observaciones } = req.body
    const response = await db.any(`INSERT INTO tbl_guardia (cedula, nombre, apellido, telefono, observaciones) 
    values($1,$2,$3,$4,$5)`, [cedula, nombre, apellido, telefono, observaciones])
    res.json({
        message: 'tbl_guardia creada correctamente'
    })
}

const putUpdateGuardias = async (req, res) => {
    const { cedula, nombre, apellido, telefono, observaciones } = req.body
    const response = await db.any(`UPDATE tbl_guardia set nombre=$2, apellido=$3, telefono=$4, observaciones=$5 
    where cedula=$1`, [cedula, nombre, apellido, telefono, observaciones])
    res.json({
        message: 'Cliente actualizado correctamente'
    })
}

















// Pedidos

const getPedidos = async (req, res) => {

    const response = await db.any("SELECT pe.id_pedido, pe.fecha_pedido, pe.fecha_entrega, pe.cantidad_libras, pe.ruta, pe.observasiones,(cl.nombre || ' ' || cl.apellido) as client, estado  FROM tbl_pedido pe INNER join tbl_cliente cl on cl.cedula=pe.fk_tbl_cliente_cedula where pe.estado=false")
    res.json(response)
}

const getPedidosCount = async (req, res) => {

    const response = await db.any("	SELECT count(id_pedido) as num_pedido FROM tbl_pedido;")
    res.json(response)
}

const postCreatePedidos = async (req, res) => {
    const { numero_pollos, fecha_pedido, fecha_entrega, cantidad_libras, ruta, observasiones, observacionesPrestamo, fk_tbl_cliente_cedula, accion, numero_tinas, fk_tbl_guardia_cedula, numero_acta, cantidad_libras_p } = req.body
    if (accion == 'true') {
        const response = await db.any(`INSERT INTO tbl_pedido (fecha_pedido, fecha_entrega, cantidad_libras, ruta, observasiones, fk_tbl_cliente_cedula, estado) 
        values($1,$2,$3,$4,$5, $6, true)`, [fecha_pedido, fecha_pedido, cantidad_libras, ruta, observasiones, fk_tbl_cliente_cedula])

        const resultPedido = await db.any("SELECT * FROM tbl_pedido ORDER BY id_pedido DESC LIMIT 1;")
        const respo = await db.any(`INSERT INTO tbl_despacho (fecha_despacho, cantidad_libras, numero_tinas, ruta, observasiones, fk_tbl_cliente_cedula, fk_tbl_guardia_cedula, estado, id_pedido_fk) 
        values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_pedido, cantidad_libras, numero_tinas, ruta, observasiones, fk_tbl_cliente_cedula, fk_tbl_guardia_cedula, true, resultPedido[0].id_pedido])

        const resultDespacho = await db.any("SELECT * FROM tbl_despacho ORDER BY id_despacho DESC LIMIT 1;")


        ///TBL prestamos///
        const resultPrestamos = await db.any("SELECT * FROM tbl_prestamo_tinas where fk_tbl_cliente_cedula=$1", [fk_tbl_cliente_cedula])
        // console.log(resultPrestamos)
        if (resultPrestamos == "") {
            const respons = await db.any(`INSERT INTO tbl_prestamo_tinas (numero_tinas, fecha_prestamo, observasiones, fk_tbl_cliente_cedula, numero_acta, fecha_entrega,id_despacho_fk, product_id,  estado) 
            values($1,$2,$3,$4,$5,$6,$7,1,false)`, [numero_tinas, fecha_pedido, observacionesPrestamo, fk_tbl_cliente_cedula, numero_acta, fecha_entrega, resultDespacho[0].id_despacho])

        } else {

            const response = await db.any(`UPDATE tbl_prestamo_tinas
            SET  numero_tinas=$2, fecha_entrega=$3
            WHERE id_prestamo_tinas=$1`, [resultPrestamos[0].id_prestamo_tinas, (resultPrestamos[0].numero_tinas + numero_tinas), fecha_entrega])
        }


        res.json({
            message: 'AyudanteA creado correctamente'
        })
    } else if (accion == 'false') {
        const response = await db.any(`INSERT INTO tbl_pedido (fecha_pedido, cantidad_libras, ruta, observasiones, fk_tbl_cliente_cedula, num_pollos, cantidad_libras_p,estado) 
        values($1,$2,$3,$4,$5,$6,$7,$8)`, [fecha_pedido, cantidad_libras, ruta, observasiones, fk_tbl_cliente_cedula, numero_pollos, cantidad_libras_p, false])
        res.json({
            message: 'AyudanteA creado correctamente'
        })
    }




}

const putUpdatePedidos = async (req, res) => {
    const { id_pedido, fecha_pedido, fecha_entrega, cantidad_libras, ruta, observasiones, fk_tbl_cliente_cedula } = req.body
    const response = await db.any(`UPDATE tbl_pedido set fecha_pedido=$2, fecha_entrega=$3, cantidad_libras=$4, ruta=$5, observasiones=$6, fk_tbl_cliente_cedula=$7
    where id_pedido=$1`, [id_pedido, fecha_pedido, fecha_entrega, cantidad_libras, ruta, observasiones, fk_tbl_cliente_cedula])
    res.json({
        message: 'Pedido actualizado correctamente'
    })
}
// despachos
const getDespachos = async (req, res) => {
    const response = await db.any("select d.id_despacho, d.fecha_despacho, d.numero_tinas, d.cantidad_libras, d.ruta, d.observasiones, (cl.nombre || ' ' || cl.apellido) as cliente, (g.nombre  || ' ' || g.apellido) as guardia from tbl_despacho d inner join tbl_guardia g on d.fk_tbl_guardia_cedula = g.cedula inner join tbl_cliente cl on cl.cedula = d.fk_tbl_cliente_cedula where d.estado=true")
    res.json(response)
}

const getDataPedido = async (req, res) => {
    const id_pedido = req.params.id_pedido;
    // const { id_pedido } = req.body
    const respPedido = await db.any("SELECT * FROM tbl_pedido where id_pedido=$1", [id_pedido]);
    // const response = await db.any("select d.id_despacho, d.fecha_despacho, d.numero_tinas, d.cantidad_libras, d.ruta, d.observasiones, (cl.nombre || ' ' || cl.apellido) as cliente, (g.nombre  || ' ' || g.apellido) as guardia from tbl_despacho d inner join tbl_guardia g on d.fk_tbl_guardia_cedula = g.cedula inner join tbl_cliente cl on cl.cedula = d.fk_tbl_cliente_cedula where d.estado=true")
    res.json(respPedido)
}

const getnumTInas = async (req, res) => {
    const id_cliente = req.params.id_cliente;
    // const { id_pedido } = req.body
    const respPedido = await db.any("select sum(numero_tinas) as numero_tinas from tbl_prestamo_tinas where fk_tbl_cliente_cedula=$1 and estado=false", [id_cliente]);
    // const response = await db.any("select d.id_despacho, d.fecha_despacho, d.numero_tinas, d.cantidad_libras, d.ruta, d.observasiones, (cl.nombre || ' ' || cl.apellido) as cliente, (g.nombre  || ' ' || g.apellido) as guardia from tbl_despacho d inner join tbl_guardia g on d.fk_tbl_guardia_cedula = g.cedula inner join tbl_cliente cl on cl.cedula = d.fk_tbl_cliente_cedula where d.estado=true")
    res.json(respPedido)
}


const getnumTInasP = async (req, res) => {
    const id_pedido = req.params.id_pedido;
    // const { id_pedido } = req.body
    const respPed = await db.any("select * from tbl_pedido where id_pedido= $1", [id_pedido]);

    // const respPedido = await db.any("select pt.numero_tinas as numero_tinas from tbl_pedido pd inner join tbl_despacho d on pd.id_pedido=d.id_pedido_fk inner join tbl_prestamo_tinas pt on d.id_despacho=pt.id_despacho_fk where id_pedido=$1 and pt.estado=false", [id_pedido]);
    // const response = await db.any("select d.id_despacho, d.fecha_despacho, d.numero_tinas, d.cantidad_libras, d.ruta, d.observasiones, (cl.nombre || ' ' || cl.apellido) as cliente, (g.nombre  || ' ' || g.apellido) as guardia from tbl_despacho d inner join tbl_guardia g on d.fk_tbl_guardia_cedula = g.cedula inner join tbl_cliente cl on cl.cedula = d.fk_tbl_cliente_cedula where d.estado=true")
    const respPedido = await db.any("select sum(numero_tinas) as numero_tinas from tbl_prestamo_tinas where fk_tbl_cliente_cedula=$1 and estado=false", [respPed[0].fk_tbl_cliente_cedula]);

    res.json(respPedido)
}
const postCreateDespachos = async (req, res) => {
    const { id_pedido, numero_tinas, fk_tbl_guardia_cedula, observasionesPrestamo, numero_acta, fecha_actual, fecha_entrega } = req.body
    const respPedido = await db.any("SELECT * FROM tbl_pedido where id_pedido=$1", [id_pedido]);
    // console.log(respPedido)
    const respUdpdatePedido = await db.any("UPDATE tbl_pedido SET  fecha_entrega=$2, estado=$3 WHERE id_pedido=$1;", [id_pedido, fecha_actual, true]);

    //CONSULTAS AL PEDIDO

    //ACTUALIZAR EL PEDIDO
    //
    const response = await db.any(`INSERT INTO tbl_despacho (fecha_despacho, cantidad_libras, numero_tinas, ruta, observasiones, fk_tbl_cliente_cedula, fk_tbl_guardia_cedula, estado, id_pedido_fk) 
    values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_actual, respPedido[0].cantidad_libras, numero_tinas, respPedido[0].ruta, "", respPedido[0].fk_tbl_cliente_cedula, fk_tbl_guardia_cedula, true, id_pedido])

    const resultDespacho = await db.any("SELECT * FROM tbl_despacho ORDER BY id_despacho DESC LIMIT 1;")

    const resultPrestamos = await db.any("SELECT * FROM tbl_prestamo_tinas where fk_tbl_cliente_cedula=$1", [respPedido[0].fk_tbl_cliente_cedula])

    if (resultPrestamos == "") {
        const respons = await db.any(`INSERT INTO tbl_prestamo_tinas (numero_tinas, fecha_prestamo, observasiones, fk_tbl_cliente_cedula, numero_acta, fecha_entrega,id_despacho_fk, product_id,  estado) 
        values($1,$2,$3,$4,$5,$6,$7,1,false)`, [numero_tinas, fecha_actual, observasionesPrestamo, respPedido[0].fk_tbl_cliente_cedula, numero_acta, fecha_entrega, resultDespacho[0].id_despacho])
        res.json({
            message: 'tbl_despacho creada correctamente'

        })
    } else {
        const response = await db.any(`UPDATE tbl_prestamo_tinas
            SET  numero_tinas=$2, fecha_entrega=$3
            WHERE id_prestamo_tinas=$1`, [resultPrestamos[0].id_prestamo_tinas, (resultPrestamos[0].numero_tinas + numero_tinas), fecha_entrega])

        res.json({
            message: 'AyudanteA creado correctamente'
        })
    }



    // console.log("paso")


}
const putUpdateDespachos = async (req, res) => {
    const { id_despacho, fecha_despacho, cantidad_libras, numero_tinas, ruta, observasiones, fk_tbl_cliente_cedula, fk_tbl_guardia_cedula } = req.body
    const response = await db.any(`UPDATE tbl_despacho set fecha_despacho=$2, cantidad_libras=$3, numero_tinas=$4, ruta=$5, observasiones=$6, fk_tbl_cliente_cedula=$7, fk_tbl_guardia_cedula=$8
    where id_despacho=$1`, [id_despacho, fecha_despacho, cantidad_libras, numero_tinas, ruta, observasiones, fk_tbl_cliente_cedula, fk_tbl_guardia_cedula])
    res.json({
        message: 'Despacho actualizado correctamente'

    })
}

// prestamo tinas
const getPrestamos = async (req, res) => {
    const response = await db.any("select pt.id_prestamo_tinas, pt.fecha_prestamo, pt.numero_tinas, pt.observasiones, pt.numero_acta, pt.fecha_entrega, (cl.nombre || ' ' || cl.apellido) as cliente from tbl_prestamo_tinas pt inner join tbl_cliente cl  on pt.fk_tbl_cliente_cedula = cl.cedula where pt.numero_tinas>0 ")
    res.json(response)


}
const getNumPrestamos = async (req, res) => {
    const response = await db.any("select count(id_prestamo_tinas) from tbl_prestamo_tinas where now()>fecha_entrega and numero_tinas>0")
    res.json(response)


}



const getPrestamos2 = async (req, res) => {
    const response = await db.any("SELECT (cl.nombre || ' '|| cl.apellido) as cliente, pt.numero_tinas, pt.fecha_prestamo,pt.fecha_entrega, pt.id_prestamo_tinas FROM public.tbl_prestamo_tinas pt inner join tbl_cliente cl on cl.cedula = pt.fk_tbl_cliente_cedula where numero_tinas >0;")
    res.json(response)


}
const getPrestamosss = async (req, res) => {
    const response = await db.any("SELECT (cl.nombre || ' '|| cl.apellido) as cliente, pt.numero_tinas, pt.fecha_prestamo,pt.fecha_entrega, pt.id_prestamo_tinas FROM public.tbl_prestamo_tinas pt inner join tbl_cliente cl on cl.cedula = pt.fk_tbl_cliente_cedula where numero_tinas >0 and now()>fecha_entrega;")
    res.json(response)


}
const getCountPrestamos = async (req, res) => {
    const response = await db.any("SELECT sum(numero_tinas) as num_prestamo FROM tbl_prestamo_tinas")
    res.json(response)


}
const postCreatePrestamos = async (req, res) => {

    const { numero_tinas, fecha_prestamo, observasiones, numero_acta, fecha_entrega, fk_tbl_cliente_cedula, product_id } = req.body
    const response = await db.any(`INSERT INTO tbl_prestamo_tinas (numero_tinas, fecha_prestamo, observasiones, numero_acta, fecha_entrega, fk_tbl_cliente_cedula,product_id) 
    values($1,$2,$3,$4,$5,$6,1)`, [numero_tinas, fecha_prestamo, observasiones, numero_acta, fecha_entrega, fk_tbl_cliente_cedula, product_id])
    res.json({
        message: 'tbl_prestamo_tinas creada correctamente'


    })
}

const putUpdatePrestamos = async (req, res) => {

    const { id_prestamo_tinas, numero_tinas, fecha_prestamo, observasiones, numero_acta, fecha_entrega, fk_tbl_cliente_cedula, product_id } = req.body
    const response = await db.any(`UPDATE tbl_prestamo_tinas set numero_tinas=$2, fecha_prestamo=$3, observasiones=$4, numero_acta=$5, fecha_entrega=$6, fk_tbl_cliente_cedula=$7
    where id_prestamo_tinas=$1 AND product_id=1`, [id_prestamo_tinas, numero_tinas, fecha_prestamo, observasiones, numero_acta, fecha_entrega, fk_tbl_cliente_cedula, product_id])
    res.json({
        message: 'Prestamo tinas actualizado correctamente'


    })
}

// ingreso insumos
const getInsumos = async (req, res) => {
    const response = await db.any("select i.id_insumos, i.fecha_ingreso, i.fecha_salida, i.cantidad_libras, i.observasiones, (gu.nombre || ' ' || gu.apellido) as guardia from tbl_ingreso_insumos i inner join tbl_guardia gu on i.fk_tbl_guardia_cedula = gu.cedula")
    res.json(response)
}

const postCreateInsumos = async (req, res) => {
    const { fecha_ingreso, fecha_salida, cantidad_libras, observasiones, fk_tbl_guardia_cedula } = req.body
    const response = await db.any(`INSERT INTO tbl_ingreso_insumos (fecha_ingreso, fecha_salida, cantidad_libras, observasiones, fk_tbl_guardia_cedula) 
    values($1,$2,$3,$4,$5)`, [fecha_ingreso, fecha_salida, cantidad_libras, observasiones, fk_tbl_guardia_cedula])
    res.json({
        message: 'tbl_ingreso_insumos creada correctamente'

    })
}

const putUpdateInsumos = async (req, res) => {
    const { id_insumos, fecha_ingreso, fecha_salida, cantidad_libras, observasiones, fk_tbl_guardia_cedula } = req.body
    const response = await db.any(`UPDATE tbl_ingreso_insumos set fecha_ingreso=$2, fecha_salida=$3, cantidad_libras=$4, observasiones=$5, fk_tbl_guardia_cedula=$6
    where id_insumos=$1`, [id_insumos, fecha_ingreso, fecha_salida, cantidad_libras, observasiones, fk_tbl_guardia_cedula])
    res.json({
        message: 'Insumo actualizado correctamente'
    })
}



/* Autoridades  */

const getAutoridades = async (req, res) => {
    const response = await db.any("select * from tbl_autoridades")
    res.json(response)
}

const postCreateAutoridades = async (req, res) => {

    const { nombre, apellido } = req.body

    const response = await db.any(`INSERT INTO tbl_autoridades (nombre, apellido) 
    values($1,$2)`, [nombre, apellido])
    res.json({
        message: 'tbl_autoridades creada correctamente'

    })
}

const putUpdateAutoridades = async (req, res) => {

    const { id, nombre, apellido } = req.body

    const response = await db.any(`UPDATE tbl_autoridades set nombre=$2, apellido=$3 
    where id=$1`, [id, nombre, apellido])
    res.json({
        message: 'Autoridad actualizado correctamente'

    })
}




/* Recilcados  */

const getReciclados = async (req, res) => {
    const response = await db.any("select r.id, r.fecha, r.numero_acta, r.cantidad, r.observacion, (a.nombre || ' ' || a.apellido) as autoridad from tbl_recicladas r inner join tbl_autoridades a on r.fk_tbl_autoridades_id = a.id")
    res.json(response)
}

const postCreateReciclados = async (req, res) => {

    const { fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id } = req.body

    const response = await db.any(`INSERT INTO tbl_recicladas (fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id) 
    values($1,$2 ,$3, $4, $5, 1)`, [fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id])
    res.json({
        message: 'tbl_recicladas creada correctamente'

    })
}

const putUpdateReciclados = async (req, res) => {
    const { id, fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id } = req.body
    const response = await db.any(`UPDATE tbl_recicladas set fecha=$2, numero_acta=$3, cantidad=$4, observacion=$5, fk_tbl_autoridades_id=$6
    where id=$1 AND  product_id=1`, [id, fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id])
    res.json({
        message: 'Autoridad actualizado correctamente'

    })
}


/* Devolución  */

const getDevolucion = async (req, res) => {

    const response = await db.any("select d.id, d.cantidad,d.observacion,d.fecha, (cl.nombre ||' ' || cl.apellido) as cliente  from tbl_devolucion d inner join tbl_prestamo_tinas tp on d.fk_tbl_prestamo_tinas_id=tp.id_prestamo_tinas  inner join tbl_cliente cl  on cl.cedula = tp.fk_tbl_cliente_cedula")

    res.json(response)
}



const postCreateDevolucion = async (req, res) => {

    const { cantidad, observacion, fecha, fk_tbl_prestamo_tinas_id, product_id } = req.body
    const response = await db.any(`INSERT INTO tbl_devolucion (cantidad, observacion, fecha, fk_tbl_prestamo_tinas_id, product_id) 
    values($1,$2, $3, $4,1)`, [cantidad, observacion, fecha, fk_tbl_prestamo_tinas_id, product_id])

    const resultPrestamos = await db.any("SELECT * FROM tbl_prestamo_tinas where id_prestamo_tinas=$1", [fk_tbl_prestamo_tinas_id])


    const resp = await db.any(`UPDATE tbl_prestamo_tinas
    SET  numero_tinas=$2
    WHERE id_prestamo_tinas=$1`, [fk_tbl_prestamo_tinas_id, (resultPrestamos[0].numero_tinas - cantidad)])

    res.json({
        message: 'tbl_devolucion creada correctamente'



    })
}

const putUpdateDevolucion = async (req, res) => {

    const { id, cantidad, observacion, fecha, fk_tbl_prestamo_tinas_id, product_id } = req.body
    const response = await db.any(`UPDATE tbl_devolucion set cantidad=$2, observacion=$3, fecha=$4,  fk_tbl_prestamo_tinas_id=$5
    where id=$1 AND product_id = 1`, [id, cantidad, observacion, fecha, fk_tbl_prestamo_tinas_id, product_id])
    res.json({
        message: 'Decoluciones actualizado correctamente'


    })
}

/* Tinas  */

const getTinas = async (req, res) => {
    const response = await db.any("select * from tbl_tinas")
    res.json(response)
}


/* Compras  */

const getCompras = async (req, res) => {
    const response = await db.any("select c.id_compras, c.fecha, c.numero_acta, c.cantidad, c.observacion, (a.nombre || ' ' || a.apellido) as autoridad from tbl_compras c inner join tbl_autoridades a on c.fk_tbl_autoridades_id = a.id")
    res.json(response)
}

const postCreateCompras = async (req, res) => {

    const { fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id } = req.body
    const response = await db.any(`INSERT INTO tbl_compras (fecha, numero_acta,cantidad, observacion,fk_tbl_autoridades_id, product_id) 
    values($1,$2,$3,$4,$5,1)`, [fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id])

    res.json({
        message: 'Compra creada correctamente'
    })
}



const putUpdateCompras = async (req, res) => {

    const { id_compras, fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id } = req.body
    const response = await db.any(`UPDATE tbl_compras set fecha=$2, numero_acta=$3, cantidad=$4,  observacion=$5, fk_tbl_autoridades_id=$6
    where id_compras=$1 AND product_id = 1`, [id_compras, fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id])

    res.json({
        message: 'Compra actualizada correctamente'
    })
}

// Bitacora
const getBitacora = async (req, res) => {
    const response = await db.any("select * from tbl_bitacora order by fecha_actual desc")
    res.json(response)
}

const getBitacorabyClientandAyudante = async (req, res) => {
    const { busqueda } = req.body;
    sql = `select * from tbl_bitacora where cliente || ayudante like '%` + busqueda + `%'`;

    const response = await db.any(sql)

    res.json(response)
}

const postCreateDevolucionAuto = async (req, res) => {

    const { id_prestamo_tinas, fecha } = req.body
    const respPrestamo = await db.any('SELECT id_prestamo_tinas, numero_tinas, fecha_prestamo, observasiones, fk_tbl_cliente_cedula, numero_acta, fecha_entrega, product_id, estado, id_despacho_fk FROM tbl_prestamo_tinas where id_prestamo_tinas=$1', [id_prestamo_tinas]);
    if (respPrestamo == '') {
        console.log("1")
        response.send(`{"status":"Error", "resp":""}`)
    } else {
        console.log("2")
        const respDevolucion = await db.any(`INSERT INTO tbl_devolucion( cantidad, observacion, fecha, fk_tbl_prestamo_tinas_id, product_id) 
        VALUES ($1, $2, $3, $4, $5)`,
            [respPrestamo[0].numero_tinas, 'Devolución completa', fecha, id_prestamo_tinas, 1])
            console.log("3")


        const resp = await db.any(`UPDATE tbl_prestamo_tinas
    SET  numero_tinas=$2
    WHERE id_prestamo_tinas=$1`, [id_prestamo_tinas, 0])
        res.json({
            message: 'Compra creada correctamente'
        })
        console.log("4")

    }


    // const response = await db.any(`INSERT INTO tbl_compras (fecha, numero_acta,cantidad, observacion,fk_tbl_autoridades_id, product_id) 
    // values($1,$2,$3,$4,$5,1)`, [fecha, numero_acta, cantidad, observacion, fk_tbl_autoridades_id, product_id])

    // res.json({
    //     message: 'Compra creada correctamente'
    // })
}
const postCreateBitacora = async (req, res) => {

    const { fecha_actual, movimiento, accion, cantidad, ayudante, cliente, observacion, numero_acta, usuario } = req.body
    if (movimiento == "Recicladas") {

        const response = await db.any("select (nombre || ' ' || apellido) as ayudante from tbl_autoridades where id=$1", [ayudante])

        if (response == '') {
            res.status(200).send('error')
        } else {
            const resultCompra = await db.any(`INSERT INTO tbl_bitacora (fecha_actual, movimiento, accion,cantidad, ayudante, cliente, observacion, numero_acta, usuario) 
            values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_actual, movimiento, accion, cantidad, response[0].ayudante, cliente, observacion, numero_acta, usuario])
            res.status(200).send('OK')
        }


    }
    else if (movimiento == 'Compra') {
        const response = await db.any("select (nombre || ' ' || apellido) as ayudante from tbl_autoridades where id=$1", [ayudante])
        if (response == '') {
            res.status(200).send('error')
        } else {
            const resultCompra = await db.any(`INSERT INTO tbl_bitacora (fecha_actual, movimiento, accion,cantidad, ayudante, cliente, observacion, numero_acta, usuario) 
            values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_actual, movimiento, accion, cantidad, response[0].ayudante, cliente, observacion, numero_acta, usuario])
            res.status(200).send('OK')
        }


    } else if (movimiento == 'Devolución') {
        const response = await db.any("select * from tbl_prestamo_tinas where id_prestamo_tinas=$1", [cliente])

        if (response == '') {
            res.status(200).send('error')
        } else {
            const responseC = await db.any("select (nombre || ' ' || apellido) as cliente from tbl_cliente  where cedula=$1", [response[0].fk_tbl_cliente_cedula])
            if (responseC == '') {
                res.status(200).send('error')
            } else {
                // console.log(responseC)
                const resultDev = await db.any(`INSERT INTO tbl_bitacora (fecha_actual, movimiento, accion,cantidad, ayudante, cliente, observacion, numero_acta, usuario) 
                values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_actual, movimiento, accion, cantidad, ayudante, responseC[0].cliente, observacion, response[0].numero_acta, usuario])
                res.status(200).send('OK')
            }

        }

    } else if (movimiento == 'Pedido') {
        const responseC = await db.any("select (nombre || ' ' || apellido) as cliente from tbl_cliente  where cedula=$1", [cliente])
        if (responseC == '') {
            res.status(200).send('error')
        } else {
            const resultCompra = await db.any(`INSERT INTO tbl_bitacora (fecha_actual, movimiento, accion,cantidad, ayudante, cliente, observacion, numero_acta, usuario) 
            values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_actual, movimiento, accion, cantidad, ayudante, responseC[0].cliente, observacion, numero_acta, usuario])
            res.status(200).send('OK')
        }

    } else if (movimiento == 'Despacho') {
        const responseC = await db.any("select (nombre || ' ' || apellido) as cliente from tbl_cliente  where cedula=$1", [cliente])
        const responseA = await db.any("select (nombre || ' ' || apellido) as ayudante from tbl_guardia  where cedula=$1", [ayudante])

        if (responseC == '' || responseA == '') {
            res.status(200).send('error')
        } else {
            const resultCompra = await db.any(`INSERT INTO tbl_bitacora (fecha_actual, movimiento, accion,cantidad, ayudante, cliente, observacion, numero_acta, usuario) 
            values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_actual, movimiento, accion, cantidad, responseA[0].ayudante, responseC[0].cliente, observacion, numero_acta, usuario])
            res.status(200).send('OK')
        }

    } else if (movimiento == 'Insumos') {
        const responseA = await db.any("select (nombre || ' ' || apellido) as ayudante from tbl_guardia  where cedula=$1", [ayudante])
        if (responseA == '') {
            res.status(200).send('error')
        } else {
            const resultCompra = await db.any(`INSERT INTO tbl_bitacora (fecha_actual, movimiento, accion,cantidad, ayudante, cliente, observacion, numero_acta, usuario) 
            values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_actual, movimiento, accion, cantidad, responseA[0].ayudante, cliente, observacion, numero_acta, usuario])
            res.status(200).send('OK')
        }


    } else if (movimiento == 'Préstamo') {

        const responseC = await db.any("select (nombre || ' ' || apellido) as cliente from tbl_cliente  where cedula=$1", [cliente])

        if (responseC == '') {

            res.status(200).send('errorasdasd  as' + responseC)
        } else {


            const resultCompra = await db.any(`INSERT INTO tbl_bitacora (fecha_actual, movimiento, accion,cantidad, ayudante, cliente, observacion, numero_acta, usuario) 
            values($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [fecha_actual, movimiento, accion, cantidad, ayudante, responseC[0].cliente, observacion, numero_acta, usuario])

            res.status(200).send('OK')

        }

    }
}



module.exports = {
    getClientes,
    getGuardias,
    getPedidos,
    getUsuarios,
    getDespachos,
    getNumPrestamos,
    getPrestamos,
    getPrestamos2,
    getInsumos,
    getAutoridades,
    getTinas,
    getCompras,
    getReciclados,
    getDevolucion,
    getBitacora,
    postCreateClientes,
    postCreateGuardias,
    postCreatePedidos,
    postCreateInsumos,
    postCreateDespachos,
    postCreatePrestamos,
    postCreateAutoridades,
    postCreateReciclados,
    postCreateDevolucion,
    postCreateCompras,
    postCreateBitacora,
    putUpdateClientes,
    putUpdateGuardias,
    putUpdatePedidos,
    putUpdateDespachos,
    putUpdatePrestamos,
    putUpdateInsumos,
    putUpdateAutoridades,
    putUpdateReciclados,
    putUpdateDevolucion,
    putUpdateCompras,
    getClientesCount,
    getPedidosCount,
    getCountPrestamos,
    getBitacorabyClientandAyudante,
    putUpdateUsuarios,
    postCreateUsuarios
    , getDataPedido,
    getnumTInas,
    getnumTInasP,
    getPrestamosss,
    postCreateDevolucionAuto

}