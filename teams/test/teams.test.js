const chai = require('chai');
const chaiHttp = require('chai-http');
const usersController = require('../../auth/users.controller');
const teamsController = require('../teams.controller');

chai.use(chaiHttp);

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

afterEach( async () => { // Especificamos que la función sea asíncrona para usar await
    await teamsController.cleanUpTeams() // Utilizamos await en lugar de then(() => {done();}) al usar promesas.
})

describe('Suite de pruebas para teams', () =>{
    it('should return the team of the given user', (done) => {
        let team = [{name: 'Charizard'}, {name: 'Blastoise'}, {name: 'Pîkachu'}];
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'U1', password: '4321'})
            .end((err,res) => {
                // Nos guardamos el token de la respuesta a la autenticación, ya que luego nos hará falta en el put y en el get 
                // (y la respuesta de estos comandos no incluye el token):
                let token = res.body.token;
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .put('/team')
                    .send({team: team})
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .get('/team')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                // De momento nuestro equipo va a tener un Charizard y un Blastoise y se van a añadir a un JSON con la siguiente estructura:
                                // {trainer: 'mastermind, team: [Charizard, Blastoise]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'U1');
                                chai.assert.equal(res.body.team.length, team.length);
                                chai.assert.equal(res.body.team[0].name, team[0].name);
                                chai.assert.equal(res.body.team[1].name, team[1].name);
                                done();
                            });
                    });
            });
    });

    it('should return the pokedex number of the pokemon', (done) => {
        let pokemonName = 'Bulbasaur';
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            // Nos registraremos con el otro usuario creado en la base de datos, ya que si no, tendríamos que tener en cuenta que ya hay 3 pokemons en el equipo de U1 al 
            // crear este test y esto complicaría las cosas sin necesidad:
            .send({user: 'A1', password: '1234'})
            .end((err,res) => {
                // Nos guardamos el token de la respuesta a la autenticación, ya que luego nos hará falta en el put y en el get 
                // (y la respuesta de estos comandos no incluye el token).
                let token = res.body.token;
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .post('/team/pokemons')
                    .send({name: pokemonName})
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .get('/team')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                // De momento nuestro equipo va a tener un Charizard y un Blastoise y se van a añadir a un JSON con la siguiente estructura:
                                // {trainer: 'mastermind, team: [Charizard, Blastoise]}
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.trainer, 'A1');
                                chai.assert.equal(res.body.team.length, 1);
                                chai.assert.equal(res.body.team[0].name, pokemonName);
                                chai.assert.equal(res.body.team[0].pokedexNumber, 1);
                                done();
                            });
                    });
            });
    });


// Test para comprobar el funcionamiento de la funcionalidad "delete":
    it('should return the team without Blastoise', (done) => {
        let team = [{name: 'Charizard'}, {name: 'Blastoise'}, {name: 'Pîkachu'}];
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'U1', password: '4321'})
            .end((err,res) => {
                // Nos guardamos el token de la respuesta a la autenticación, ya que luego nos hará falta en el put y en el get 
                // (y la respuesta de estos comandos no incluye el token):
                let token = res.body.token;
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .put('/team')
                    .send({team: team})
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .delete('/team/pokemons/1')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.request(app)
                                    .get('/team')
                                    .set('Authorization', `JWT ${token}`)
                                    .end((err, res) => {
                                        // De momento nuestro equipo va a tener un Charizard y un Blastoise y se van a añadir a un JSON con la siguiente estructura:
                                        // {trainer: 'mastermind, team: [Charizard, Blastoise]}
                                        chai.assert.equal(res.statusCode, 200);
                                        chai.assert.equal(res.body.trainer, 'U1');
                                        chai.assert.equal(res.body.team.length, team.length - 1);
                                        console.log(res.body.team[1].name)
                                        done();
                                });
                            });
                    });
            });
    });

    it('should not be able to add Pokemons if the user has already got 6 in your team', (done) => {
        let team = [
            {name: 'Charizard'},
            {name: 'Blastoise'},
            {name: 'Pîkachu'},
            {name: 'Charizard'},
            {name: 'Blastoise'},
            {name: 'Pîkachu'}];
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({user: 'U1', password: '4321'})
            .end((err,res) => {
                // Nos guardamos el token de la respuesta a la autenticación, ya que luego nos hará falta en el put y en el get 
                // (y la respuesta de estos comandos no incluye el token):
                let token = res.body.token;
                chai.assert.equal(res.statusCode, 200);
                chai.request(app)
                    .put('/team')
                    .send({team: team})
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {
                        chai.request(app)
                            .post('/team/pokemons')
                            .send({name:'Vibrava'})
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.assert.equal(res.statusCode, 400);
                                done();
                            });
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
