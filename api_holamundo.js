const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    // req es la request (la peticion)
    // res es la respuesta
    res.status(200).send('¡Hola Mundo!')
})

app.listen(port, () => {
    console.log('Server started at port 3000');
})
