
// Este será un primer ejemplo de test end-to-end. También se les llama "test de integración".

const chai = require('chai');
const chaiHttp = require('chai-http'); // chaiHttp es un plugin que le da funcionalidades a chai para poder levantar servidores y para poder hacer llamadas http sobre dichos servidores.

chai.use(chaiHttp); // Informamos a chai de que queremos usar el pluging chaiHttp

//Queremos que chai use como servidor, aquel que hemos levantado en el archivo PokeAPI.
const app = require('../../PokeAPI').app; 

describe('Suite de prueba e2e para el curso', () => {
    it('should return hello world', (done) => {
        chai.request(app) // Pedimos que se utilice el servidor previamente definido (el de la PokeAPI).
            .get('/') // Realizamos la llamada al servidor y se realizan los cálculos relativos a la misma.
            .end((err,res) => { // La función end recibe el resultado de la operación get (el resultado de la llamada al servidor), ya sea un resultado o un error.
                chai.assert.equal(res.text, '¡Hola Mundo!') // Añadimos el test que queramos realizar. En esta ocasión comprobamos que el texto que ha devuelto como respuesta es '¡Hola Mundo!'.
                done(); // Especificamos cuando termina el test, ya que de lo contrario, nodejs arranca el test y en antes de que acabe, ya va ejecutando en paralelo las siguientes líneas que pongamos dentro del mismo it.
            });
    });
});