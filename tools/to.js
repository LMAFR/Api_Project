// Creamos una función que englobe las promesas de forma genérica y gestione los errores por nosotros:
const to = (promise) => {
    // Si se cumple la promesa, devolvemos la información correspondiente con un then():
    return promise.then(data => {
        return [null, data]; // Devolvemos un null en la parte del error y la información en la otra parte
    // El caso de error lo recogemos con un catch:
    }).catch(err => [err, null]); // Si se da el error, devolvemos el error en su correspondiente apartado y null en la parte de la 
                                  // información.
}

exports.to = to;