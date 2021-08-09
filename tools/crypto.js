const bcrypt = require('bcrypt'); // Librería que usaremos para encriptar las contraseñas. En la documentación se recomienda usarlo con cifrado asíncrono.

const hashPassword = (plainTextPwd, done) => {
    bcrypt.hash(plainTextPwd, 10, function(err, hash) { // Realizaremos 10 iteraciones en el método de cifrado de nuestra contraseña. plainTextPwd es porque usamos contraseñas de texto plano. 
        // Store hash in your password DB
        done(err, hash) // Realmente podríamos pasar directamente "done" como tercer argumento de la función hash, ya que el argumento de done es el mismo que el de la función definida como tercer argumento (y no los usamos).
    });
};

// La siguiente función es como la anterior, pero para hacer el cifrado de forma síncrona.
const hashPasswordSync = (plainTextPwd) => {
    return bcrypt.hashSync(plainTextPwd, 10); // Obsérvese que al llevar a cabo el cifrado síncrono, no es necesario que la función devuelva un resultado ("done" en la función anterior)
};

// La siguiente función compara la contraseña cifrada con la contraseña pasada por el usuario sin cifrar, de tal forma que, si devuelve True, la contraseña será correcta.
const comparePassword = (plainTextPwd, hashPassword, done) => { // Recibe la plain password, la hash password y devuelve "done"
    bcrypt.compare(plainTextPwd, hashPassword, done); // En este caso sí hemos pasado directamente "done" como argumento.
};

exports.hashPassword = hashPassword;
exports.hashPasswordSync = hashPasswordSync;
exports.comparePassword = comparePassword;