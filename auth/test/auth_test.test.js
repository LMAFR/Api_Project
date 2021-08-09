const chai = require('chai');
const chaiHttp = require('chai-http');
const usersController = require('../users.controller');

chai.use(chaiHttp); //chaiHttp es un plugin de chai, así que se llama con .use().

const app = require('../../PokeAPI').app;

// Vamos a hacer que el estado del sistema vuelva a ser el inicial cada vez que se lanza un nuevo test. En el estado inicial no hay usuarios en la base de datos ni nada 
// guardado, en general. Para ello, mocha nos da dos herramientas: before (se lanza antes de lanzar los tests) y beforeit (se lanza antes de lanzar los it, los tests).
before((done) => {
    // Vamos a registrar un usuario para hacer los tests. Aunque esto es lo primero que se hace aquí, si los tests son asíncronos, al ejecutarlos podría ocurrir que el test 
    // termine antes de que se ejecute este comando y, por lo tanto, que el test falle simplemente porque se ha ejecutado antes de tiempo. Por eso se añade una función de cifrado
    // síncrono en crypto.js (y la función para registrar usuarios, situada en el archivo users, usa la función de cifrado síncrono).
    usersController.registerUser('A1', '1234');
    usersController.registerUser('U1', '4321');
    done();
})

describe('Suite de pruebas de autenticación', () => {
    it('should return 401 when no jwt token available', (done) => {
        // Cuando la llamada se hace con un token incorrecto
        chai.request(app) // Llamamos al servidor
            .get('/team') // pedimos que nos muestre el equipo
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 401) // Como ahora mismo no estamos enviando ningún token, forzosamente el token "recibido" es inválido, por lo que la API debe devolver 401 ("identificación fallida").
                done(); // Indicamos que aquí termina este test
            });
    });

    it('should return 400 when no data is provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 400); // Esperamos que el login no sea válido, ya que no hemos pasado credenciales. Se pasa el test si devuelve un código 400. 
                done();
            });
    });

    it('should return 200 and token for successful login', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json') // Indicamos el formato en el que vamos a pasar las credenciales a la API (JSON)
            .send({user: 'A1', password: '1234'}) // Indicamos las credenciales que hay que usar para loggearse.
            .end((err,res) =>{
                // Esperamos que el login sea válido, así que decimos que pasamos el test si tras enviar las credenciales hemos obtenido un 200.
                chai.assert.equal(res.statusCode,200);
                done();
            });
    });

    it('should return 200 when jwt is valid', (done) => {
        // Cuando la llamada se hace con un token incorrecto
        chai.request(app) // Llamamos al servidor
            .post('/auth/login') // Para poder enviar un token, necesitamos que el usuario exista y que esté loggeado. Con esta línea nos loggeamos.
            .set('content-type', 'application/json')
            .send({user: 'A1', password: '1234'})
            .end((err, res) => { // Usamos la respuesta del loggin (que será el token JWT que vamos a usar) para hacer la llamada a la API. El token está concretamente en el body de la respuesta (res) obtenida.
                chai.assert.equal(res.statusCode, 200) // Comprobamos que la autenticación se ha realizado correctamente (código 200)
                chai.request(app) // Llamamos al servidor
                    .get('/team') // pedimos que nos muestre el equipo
                    .set('Authorization', `JWT ${res.body.token}`) // Mandamos el token jwt en un header. La función set() sirve para enviar un header.
                    .end((err, res) => { // Probamos a hacer la solicitud de revisión del equipo con el token enviado
                        chai.assert.equal(res.statusCode, 200) // Si nos hemos loggeado correctamente, el endpoint devolverá 200.
                        done();
                    });  
            });
    });
});

// Al igual que un before, mocha proporciona un "after" para ejecutar acciones tras los tests (aquí limpiaremos todo lo que no queremos tras los tests,
// por ejemplo, una base de datos con usuarios ya registrados)
after((done) => {
    usersController.cleanUpUsers();
    done();
});