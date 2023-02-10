const pgPromise = require('pg-promise')
const config={
    host:'localhost',
    port:'5432',
    database:'prueba_insumos',
    user:'postgres',
    password:'12345'
    }
    
const pgp = pgPromise({})
const db = pgp(config)
exports.db=db 


/* Conección SERRVIDOR HEROKU */

//  const pgPromise = require('pg-promise')
// const config={
//     host:'ec2-3-224-164-189.compute-1.amazonaws.com',
//     port:'5432',
//     database:'d847rgbjh0ddkj',
//     user:'hjbrafgmsfforo',
//     password:'f121cd5e892953c968a581eeb211ebc214c3e1a71886ec52e6cfd61a37e510df',
//     ssl: {
//         rejectUnauthorized: false
//       }
//     }
    
// const pgp = pgPromise({})
// const db = pgp(config)
// exports.db=db   
