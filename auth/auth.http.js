const jwt = require('jsonwebtoken');

const usersController = require('./users.controller.js'); // Archivo en el que controlamos todo lo relativo a los controladores (usuario, contraseña, etc.) de los usuarios.

const loginUser = (req,res) => {
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
        let user = usersController.getUsertIdFromUserName(req.body.user);
        const token = jwt.sign({userId: user.userId}, 'secret');
        res.status(200).json(
            {token: token}
        )
    })
}

exports.loginUser = loginUser;