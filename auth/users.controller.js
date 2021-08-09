// Vamos a crear una base de datos con los datos de todos los usuarios para poder llevar a cabo el proceso de autenticación con todo aquel usuario que tenga 
// una cuenta para acceder a nuestra API.
const uuid = require('uuid'); // Es una librería para crear identificadores únicos.
const crypto = require('../tools/crypto.js'); // Archivo donde guardamos las funciones referentes a la encriptación.
// El controlador de usuarios tiene dependencia con el controlador de teams, ya que cada usuario debe tener al menos un equipo vacío.
const teams = require('../teams/teams.controller');

// Definimos la base de datos para los usuarios:
let userDatabase = {
    //'0001': { // Creamos un identificador único para cada usuario.
    //    'password': '', // Guardamos la contraseña y cómo está cifrada. Las contraseñas siempre deben ir cifradas por si recibimos un ciberataque (para que los ciberdelincuentes 
    //    'salt': '', // no tengan acceso a las claves de nuestros clientes). Además, así no podrán realizar peticiones con privilegios dentro de la API.
    //    'userName': '' // Guardamos el nombre de usuario al que corresponde este identificador.
    //}
};
// userID -> password

// Creamos una función que limpie la base de datos, para no tener que estar contando con los datos añadidos previamente cada vez que creamos un nuevo test.
const cleanUpUsers = () => {
    userDatabase = {};
}

// La siguiente función es asíncrona, por lo que espera un resultado. La función que le vamos a pasar (hashPassword), no devuelve un resultado por sí sola, de modo que hay
// que ponerla en forma asíncrona para establecer lo que hace (cifrar la contraseña) como el resultado de la función.
const registerUser = (userName, password) => {
    // Guarda en la base de datos nuestro usuario
    let hashedPwd = crypto.hashPasswordSync(password);

    let userId = uuid.v4()
    userDatabase[userId] = {
        userName: userName,
        password: hashedPwd
    }
    // La siguiente función le pondrá al usuario un equipo vacío:
    teams.bootstrapTeam(userId);
}

// Necesitaremos una función que, dado un userId, nos devuelva el diccionario que contiene el nombre del usuario 
// (para la parte de la base de datos de los equipos pokemon de los usuarios):
const getUser = (userId) => {
    return userDatabase[userId];
}

// En realidad nosotros recibimos un nombre cuando alguien se loggea en nuestra API, no un ID, por lo tanto, creamos una función que, a partir del nombre recibido, nos diga
// cuál es su ID:
const getUsertIdFromUserName = (userName) => { // Pasamos el nombre como parámetro
    for (let user in userDatabase) { // Para cada usuario en la base de datos... 
        if (userDatabase[user].userName == userName) { // comprobamos si el nombre de dicho usuario coincide con el nombre que le hemos pasado...
            let userData = userDatabase[user];
            userData.userId = user;
            return userData; // Y, si eso ocurre, devolvemos ese usuario de la base de datos.
        }
    }
}

const checkUserCredentials = (userName, password, done) => { // Como es una función asíncrona que llama a otra función asíncrona, esta función espera a un resultado y, por lo tanto, lo más fácil es que ese resultado sea el resultado que espera la función que contiene en su interior (done).
    // Comprueba que las credenciales son correctas
    console.log('Checking user credentials.')
    let user = getUsertIdFromUserName(userName);

    if (user) {
        console.log(user);
        crypto.comparePassword(password, user.password, done);
    } else {
        done('Missing User');
    }
    
}  

exports.registerUser = registerUser;
exports.checkUserCredentials =checkUserCredentials;
exports.getUsertIdFromUserName = getUsertIdFromUserName;
exports.getUser = getUser;
exports.cleanUpUsers = cleanUpUsers;
// 