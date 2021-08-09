const JwtStrategy = require('passport-jwt').Strategy, // Definimos una estrategia de autenticación utilizando la librería de passport con jsonwebtoken (jwt)
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
    // passport funciona similar a los plugins de librerías (como chaiHttp, para el que usábamos .use()). Se le pasa la instancia de la librería de passport base ("passport")
    // y luego se le señala la estrategia (pluging) concreto que se va a utilizar. 
    // Utilizaremos una función que reciba el objeto passport como parámetro:

// Configuración de passport, lo llamamos init porque es lo primero que hay que hacer en cuanto a autenticación:
const init = () => {
    const opts = { // Indicamos la configuración de la estrategia (que incluye la contraseña) como el parámetro opts
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'), // El string del token jwt lo sacamos de un header de autenticación con esquema jwt.
        secretOrKey: 'secret' // Pte: este string debería estar en una variable de entorno, ya que es una contraseña
    }
    // Indicamos la estrategia (pluging) que queremos utilizar:
    passport.use(new JwtStrategy(opts, (decoded, done) => { // Le decimos a passport la estrategia que tiene que utilizar para decodificar los tokens
        return done(null, decoded); // Devolvemos null (nada y, por lo tanto, error) si hay error o, si todo va bien, false (que más adelante será el usuario, solo que aún no hemos creado ninguno).
    }));
}

const protectWithJwt = (req, res, next) => {
    // El path del login no puede estar protegido con un token porque necesitamos hacer login para obtener el token y los paths (endpoints) de algunas funcionalidades (como 
    // la que hicimos al principio a modo de "hello world") tampoco estaban protegidas desde un principio, así que esas cosas las tenemos que tener en cuenta:
    if (req.path == '/' || req.path == '/auth/login') {
        return next(); // Dejamos pasar la petición limpia.
    }
    // El resto de rutas (endpoints) sí que las protegemos con un token. Devolvemos el middleware de passport con authenticate():
    return passport.authenticate('jwt', { session: false})(req, res, next);
}

exports.init = init;
exports.protectWithJwt = protectWithJwt;


