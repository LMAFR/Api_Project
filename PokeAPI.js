const express = require('express'); // Librería que nos permite desarrollar utilizando el protocolo HTTP. Nos permite crear endpoints, consultar el tráfico que reciben usando queries, etc.
const middlewares = require('./middlewares');

// Importamos los archivos con las rutas
const authRoutes = require('./auth/auth.routers').router;
const teamRoutes = require('./teams/teams.router').router;

const app = express(); // express() es el ejecutable que usaremos para levantar nuestro servidor. Toda nuestra API se basa en él (obsérvense las próximas líneas).

const port = 3000; // Definimos el puerto que vamos a utilizar para establecer la conexión. Es muy utilizado para el desarrollo de APIs.

// Colocamos los dos Middlewares que vamos a utilizar en la API (uno para la autenticación y otro para leer bien los JSONs):
middlewares.setupMiddlewares(app);

// Introducimos una serie de peticiones a la API

    // Por ejemplo, hacemos un get cuyo endpoint va a ser la raíz ("/")
app.get('/', (req, res) => {
    // req es la request (la peticion). Esto es lo que nos llegaría en los headers (cabeceras), esto es, los datos que queremos gestionar.
    // res es la respuesta. Lo que utilizamos para mandar la respuesta al cliente que nos ha enviado la petición.
    res.status(200).send('¡Hola Mundo!') // Mandamosla respuesta. status() sirve para mostrar un código de estado determinado junto con la respuesta que manda send.
})

// Definimos las rutas usando el fichero importado desde la carpeta routers:
app.use('/auth', authRoutes) // Ahora todas las rutas definidas en dicho fichero se podrán llamar desde este fichero (u otros que llamen a este) como /auth...
                            // Esto último es como tener nuestro propio pequeño servidor.
app.use('/team', teamRoutes)
// Para "encender" nuestra API, nos ponemos en escucha por el puerto que va a establecer la conexión: 
app.listen(port, () => {
    console.log('Server started at port 3000');
})
// Configuramos el objeto ejecutable express para que sea importable por todo aquel modulo externo que requiera utilizarlo (por ejemplo, las plataformas de testeo, como chai).
exports.app = app;