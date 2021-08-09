#Objetivo:
Definir una API para gestionar nuestro equipo Pokémon.

#Acciones:
- Identificarnos.
- Añadir Pokémon a nuestro equipo.
- Eliminar Pokémon de nuestro equipo.
- Consultar información de nuestro equipo.
- Cambiar el orden de los Pokémon en nuestro equipo.

#REST design:
- Añadir Pokémon: POST /team/pokemons
- Consultar equipo: GET /team
- Eliminar Pokémon: DELETE /teams/pokemons/:id
- Cambiar el orden: PUT /team