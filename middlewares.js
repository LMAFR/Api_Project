const bodyParser = require('body-parser'); // Es un plugin que permite leer mejor los ficheros en formato JSON.
const authmiddleware = require('./tools/auth-middleware'); // Configuramos la autenticación mediante un middleware para no tener que repetir las líneas de código de la 
                                                           // autenticación cada vez que queramos realizar una acción (un get, un put, etc.).

const setupMiddlewares = (app) => {
    app.use(bodyParser.json()); // Lo configuramos para que sea capaz de leer JSON, ya que es el formato en el que estamos trabajando. Nos será útil, por ejemplo, en la función
                                // de login.
    authmiddleware.init(); // Configuramos la autenticación. 
    app.use(authmiddleware.protectWithJwt); // Protegemos mediante un token JWT los endpoints/paths establecidos en la función protectWithJwt.
}

exports.setupMiddlewares = setupMiddlewares;