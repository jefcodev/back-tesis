/* const { db } = require("./cnn");
db.any('select * from tbl_cliente').then(res=>{console.table(res)}) */

const cors = require('cors')
const express = require('express')
require('dotenv').config();
const app= express()
//para reconocer html
const { dbConnection } = require('./database/config')

//midlewears
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({ origin: true, credentials: true  }));


//Conection

dbConnection();


//routes
app.use(require('./routes/index'));
app.use(require('./routes/auth'));





//app.get('/',(req,res)=>res.send('Bienvenidos al servicio Rest-Api-Insumos')) 

//execution server web
app.listen(process.env.PORT || 4000)
console.log("Server running ", process.env.PORT)
