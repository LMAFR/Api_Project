// En la siguiente base de datos guardaremos, por cada usuario, qué equipo pokemon tiene activo en cada momento:
let teamsDatabase = {};

// Creamos una función para eliminar el pokemon con una posición dada en el equipo de un usuario:
const deletePokemonAt = (userId, index) => {
    console.log('DELETE', userId, index);
    if (teamsDatabase[userId][index]) {
        teamsDatabase[userId].splice(index, 1); // La función splice elimina n (en este caso =1) elementos de un array a partir del índice (index) indicado (incluyéndolo).
    }
}

// Creamos una función que nos limpie la base de datos de los equipos pokemon, para que reiniciarla cada vez que vayamos a hacer un nuevo test:
const cleanUpTeams = () => {
    return new Promise((resolve, reject) => {
        for (let user in teamsDatabase) {
            teamsDatabase[user] = [];
        }
        resolve();
    })
};

// Creamos una función que, dado un UserId, nos devuelva el equipo de ese usuario:
const getTeamOfUser = (userId) => {
    return new Promise((resolve, reject) => {
        resolve(teamsDatabase[userId]);
    })
}

const bootstrapTeam = (userId) => {
    teamsDatabase[userId] = [];
}

// Creamos una función para añadir pokemons al equipo de un usuario:
const addPokemon = (userId, pokemon) => {
    return new Promise((resolve, reject) => {
        // En esta promesa vamos a hacer un check para cuando un equipo pokemon ya tenga 6 pokemons (el máximo en los juegos), esto
        // servirá para aprender a gestionar los errores en las promesas (parámetro reject). Empezamos con un check:
        if (teamsDatabase[userId].length == 6) {
            // Devolvemos un error:
            reject(); // Con solo escribir esto, la promesa falla y devolvemos el correspondiente error.
        }
        else {
            // Resolvemos la promesa:
            teamsDatabase[userId].push(pokemon);
            resolve();
        }
        
    });
}

// Creamos una función con la que podamos añadir un team completo al usuario:
const setTeam = (userId, team) => {
    teamsDatabase[userId] = team;
}

exports.bootstrapTeam = bootstrapTeam;
exports.addPokemon = addPokemon;
exports.setTeam = setTeam;
exports.getTeamOfUser = getTeamOfUser;
exports.cleanUpTeams = cleanUpTeams;
exports.deletePokemonAt = deletePokemonAt;