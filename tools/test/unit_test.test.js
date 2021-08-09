
// La librería mocha nos da el entorno para implementar los tests y chai nos permite aplicar los tests en sí (nos da una serie de funciones, que derivan de tres: should, expect o assert).
// Los tests pueden ser unitarios o end-to-end. Los primeros comprueban que las diferentes funciones de la API funcionan bien por separado y los segundos comprueban que la 
// automatización de todos los procesos está funcionando correctamente (de manera que el cliente reciba la reacción esperada por parte de la interfaz (la API) en cada caso).
const assert = require('chai').assert;

function addValue(a,b){
    return a+b;
}

// Los tests (sean de un tipo u otro) utilizan una esturctura de describe+it. El describe es una "suite" que contiene una función. Esa función está formada por una serie de
// "it"s, que son donde se colocan los test como tal. Los it y los describe tienen como primer argumento el "nombre" que les ponemos (que será un string). Las funciones se
// escriben normalmente con el formato () => {contenido de la función}, como segundo argumento.
describe('Suite de prueba para el curso', () => {
    it('should return 4', () => {
        let va = addValue(2,2);
        assert.equal(va, 4);
    })
});

// mocha busca en nuestro proyecto una carpeta test o ficheros con el nombre test, así que hemos creado una carpeta con ese nombre y dentro hemos metido esta prueba. Luego, 
// cambiando el valor del argumento "test" de package.json por './node_modules/.bin/mocha', ya podemos llamar a los tests desde la terminal escribiendo: npm run test.
// En caso de no hacer dicho cambio, habría que llamarlos usando ./node_modules/.bin/mocha, que es menos intuitivo.