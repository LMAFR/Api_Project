const express = require('express'); // Librería que nos permite desarrollar utilizando el protocolo HTTP. Nos permite crear endpoints, consultar el tráfico que reciben 
                                    // usando queries, etc.
const router = express.Router(); // En lugar de definir las rutas directamente en el archivo app (PokeAPI.js), las vamos a definir en este fichero aparte. 

const authHttpHandler = require('./auth.http');
// El constructor Router() nos crea un objeto (router) para definir las rutas.
// Por ejemplo, si quisiéramos definir la ruta raíz, lo haríamos del siguiente modo:
// router.route('/')
//     .get((req,res) =>{
//         res.send('GET Auth router')
//     })
//     .post((req,res) => {
//         res.send('POST Auth router')
//     })
// Al emplear un router, simplificamos la llamada a las rutas,

// Definimos también la ruta para el log in y definimos la aplicación para llevar a cabo el login::
router.route('/login')
    .post(authHttpHandler.loginUser)

exports.router = router;