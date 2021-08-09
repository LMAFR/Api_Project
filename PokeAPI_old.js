const express = require('express'); // Librería que nos permite desarrollar utilizando el protocolo HTTP. Nos permite crear endpoints, consultar el tráfico que reciben usando queries, etc.
const passport = require('passport'); // Importamos la librería passport.
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Es un plugin que permite leer mejor los ficheros en formato JSON.

const usersController = require('./controllers/users.js'); // Archivo en el que controlamos todo lo relativo a los controladores (usuario, contraseña, etc.) de los usuarios.
// Vamos a registrar un usuario para hacer los tests. Aunque esto es lo primero que se hace aquí, si los tests son asíncronos, al ejecutarlos podría ocurrir que el test 
// termine antes de que se ejecute este comando y, por lo tanto, que el test falle simplemente porque se ha ejecutado antes de tiempo. Por eso se añade una función de cifrado
// síncrono en crypto.js (y la función para registrar usuarios, situada en el archivo users, usa la función de cifrado síncrono).
usersController.registerUser('A1', '1234');
usersController.registerUser('U1', '4321');

require('./auth')(passport); // Llama a la función passport que se encuentra dentro del fichero auth.js. 

const app = express(); // express() es el ejecutable que usaremos para levantar nuestro servidor. Toda nuestra API se basa en él (obsérvense las próximas líneas).

app.use(bodyParser.json()); // Lo configuramos para que sea capaz de leer JSON, ya que es el formato en el que estamos trabajando. Nos será útil, por ejemplo, en la función
                            // de login.

const port = 3000; // Definimos el puerto que vamos a utilizar para establecer la conexión. Es muy utilizado para el desarrollo de APIs.

// Introducimos una serie de peticiones a la API

    // Por ejemplo, hacemos un get cuyo endpoint va a ser la raíz ("/")
app.get('/', (req, res) => {
    // req es la request (la peticion). Esto es lo que nos llegaría en los headers (cabeceras), esto es, los datos que queremos gestionar.
    // res es la respuesta. Lo que utilizamos para mandar la respuesta al cliente que nos ha enviado la petición.
    res.status(200).send('¡Hola Mundo!') // Mandamosla respuesta. status() sirve para mostrar un código de estado determinado junto con la respuesta que manda send.
})

// Creamos la aplicación para llevar a cabo el login:
app.post('/login', (req,res) => {
    // Comprobamos que realmente nos está llegando un usuario y una contraseña. Para poder hacer esta comprobación, el JSON que nos llega debe leerse en formato JSON (no en
    // formato de texto plano) y, por lo tanto, aquí el uso de body-parser es necesario (nos permite leer los JSON en formato JSON).
    if (!req.body) {
        return res.status(400).json({message: 'Missing data'});
    } else if (!req.body.user || !req.body.password) {
        return res.status(400).json({message: 'Missing data'});
    }
    // Comprobamos las credenciales:
    usersController.checkUserCredentials(req.body.user, req.body.password, (err, result) =>{
        // Si no son válidas generamos un error:
        if (!result || err) {
            return res.status(401).json({message:'Invalid Credentials'});
        }
        // Si son válidas generamos un JWT y lo devolvemos
        const token = jwt.sign({userId: result}, 'secret');
        res.status(200).json(
            {token: token}
        )
    })
});
// Añadir pokemons a nuestro equipo
app.post('/team/pokemons', () => {
    res.status(200).send('¡Hola Mundo!')
})

// Obtener un listado con nuestro equipo
// Para proteger nuestros endpoints utilizamos un sistema llamado Middleware, que nos permite encadenar funcionalidades (lógica) en una llamada. La cadena empieza por 
// la llamada que haga el usuario (en este caso se corresponde con el "/team") y terminará por el "Handler", que es la función final que se realizará si en llamada todo
// ha ido bien. Entre ambos argumentos del get, podemos incluir nuevas funciones (que serán nuestros Middlewares). Para decidir cuándo pasar de un Middleware a otro, se usa 
// la función next, que se pone como argumento de la función junto a req y res. En el handler no hace falta porque es el último Middleware. Los Middlewares sirven para 
// proteger al Handler.
app.get('/team',
    passport.authenticate('jwt', {session:false}), //passport ya lleva middlewares predefinidos, por eso APARENTEMENTE no sigue la estructura (req,res,next) => {}. Le pedimos que, a partir del endpoint /team, haga una autenticación utilizando jwt.
(req, res, next) => {
    res.status(200).send('¡Hola Mundo!')
})
// Eliminar pokemons de nuestro equipo
app.delete('/team/pokemons/:pokeid', () => {
    res.status(200).send('¡Hola Mundo!')
})
// "Mover" (gestionar) pokemons dentro de nuestro equipo
app.put('/team', () => {
    res.status(200).send('¡Hola Mundo!')
})

// Para "encender" nuestra API, nos ponemos en escucha por el puerto que va a establecer la conexión: 
app.listen(port, () => {
    console.log('Server started at port 3000');
})

// Configuramos el objeto ejecutable express para que sea importable por todo aquel modulo externo que requiera utilizarlo (por ejemplo, las plataformas de testeo, como chai).
exports.app = app;