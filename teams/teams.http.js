
const axios = require('axios').default; // Sirve para hacer llamadas a terceros (por ejemplo, la PokeAPI que hemos tomado como referencia para el proyecto)
const teamsController = require("./teams.controller");
const { getUser } = require('../auth/users.controller');
const { to } = require('../tools/to');

const getTeamFromUser = async (req, res, next) => { // Como usamos un await, la función debe ser asíncrona (especificamos async)
    let user = getUser(req.user.userId);
    let team = await teamsController.getTeamOfUser(req.user.userId) // Va a esperar hasta que se resuelva la promesa (getTeamOfUser)
    res.status(200).json({
        trainer: user.userName,
        team: team
    })
}

const setTeamToUser = (req,res) => {
    teamsController.setTeam(req.user.userId, req.body.team);
    res.status(200).send();
}

const addPokemonToTeam = async (req,res) => {
    let pokemonName = req.body.name;
    console.log('*** Calling pokeapi.co ***')
    console.log(to)
    let [pokeApiError, pokeApiResponse] = await to(axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)) 
    //Ponemos el nombre del pokemon en minúsculas porque en la API se lo llama así.
    if (pokeApiError) {
        return res.status(400).json({message: pokeApiError});
    }
    let pokemon = 
        {
        name: pokemonName,
        pokedexNumber: pokeApiResponse.data.id
        };

    let [addError, response] = await to(teamsController.addPokemon(req.user.userId, pokemon));
    if (addError) {
        return res.status(400).json({message: 'You already have 6 pokemons in your team!'});
    }
    // Devolvemos un código de status 201 para indicar que hemos creado un recurso (con addPokemon):
    res.status(201).json(pokemon);
}

const deletePokemonFromTeam = (req, res) => {
    // El usuario lo enviamos por "body", pero el parámetro "pokemon id" lo pasamos por URL, así que utilizaremos req.params:
    teamsController.deletePokemonAt(req.user.userId, req.params.pokeid);
    res.status(200).send()
}

exports.getTeamFromUser = getTeamFromUser;
exports.setTeamToUser = setTeamToUser;
exports.addPokemonToTeam = addPokemonToTeam;
exports.deletePokemonFromTeam = deletePokemonFromTeam;