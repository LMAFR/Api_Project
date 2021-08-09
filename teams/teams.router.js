const express = require('express'); // Librería que nos permite desarrollar utilizando el protocolo HTTP. Nos permite crear endpoints, consultar el tráfico que reciben usando queries, etc.
const router = express.Router(); // En lugar de definir las rutas directamente en el archivo app (PokeAPI.js), las vamos a definir en este fichero aparte. 
// const passport = require('passport'); // Importamos la librería passport. No es necesario tras la refactorización de la autenticación.

// const teamsController = require('./teams.controller') // Importamos todas las funciones del fichero de controladores para los equipos pokemon. 
// const { getUser } = require('../auth/users.controller'); // Importamos la función para sacar el nombre de usuario a partir del userId.
// Tras el refactor las dos líneas anteriores están en el fichero teams.http. 

const teamsHttpHandler = require('./teams.http');
//require('../tools/auth-middleware')(passport); // Llama a la función passport que se encuentra dentro del fichero auth.js. 

router.route('/')
    // Obtener un listado con nuestro equipo
    // Para proteger nuestros endpoints utilizamos un sistema llamado Middleware, que nos permite encadenar funcionalidades (lógica) en una llamada. La cadena empieza por 
    // la llamada que haga el usuario (en este caso se corresponde con el "/team") y terminará por el "Handler", que es la función final que se realizará si en llamada todo
    // ha ido bien. Entre ambos argumentos del get, podemos incluir nuevas funciones (que serán nuestros Middlewares). Para decidir cuándo pasar de un Middleware a otro, se usa 
    // la función next, que se pone como argumento de la función junto a req y res. En el handler no hace falta porque es el último Middleware. Los Middlewares sirven para 
    // proteger al Handler.
    .get(//passport.authenticate('jwt', {session:false}), //passport ya lleva middlewares predefinidos, por eso APARENTEMENTE no sigue la estructura (req,res,next) => {}. Le pedimos que, a partir del endpoint /team, haga una autenticación utilizando jwt.
        teamsHttpHandler.getTeamFromUser)
    // "Mover" (gestionar) pokemons dentro de nuestro equipo
    .put( // Lo primero es autenticarnos para tener acceso a la variable req.user y todo lo que contiene:
        //passport.authenticate('jwt', {session:false}),
        teamsHttpHandler.setTeamToUser)
// Añadir pokemons a nuestro equipo
router.route('/pokemons')
    .post(//passport.authenticate('jwt', {session:false}),
        teamsHttpHandler.addPokemonToTeam)
// Eliminar pokemons de nuestro equipo
router.route('/pokemons/:pokeid')
    .delete(//passport.authenticate('jwt', {session:false}),
    teamsHttpHandler.deletePokemonFromTeam)

exports.router = router;