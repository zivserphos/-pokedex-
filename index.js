
async function getPokemon(pokemonName) {
    try {
        const x = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
        return pokemonData(x.data)
    }
    catch {
        throw new Error("NOT FOUND")
    }
}

async function pokemonsWithType(type) {
    const pokemonWithType = await axios.get(`https://pokeapi.co/api/v2/type/${type}`)
    return pokemonWithType.data.pokemon
}

const pokemonData = (pokemon) => [pokemon.types ,pokemon.name , pokemon.weight , pokemon.height , pokemon.sprites.front_default, pokemon.types , pokemon.sprites.back_default]
const pokemon = getPokemon("bulbasaur").then((pokemon) => pokemon).catch((err) => console.log(err.message))
const pokemons = pokemonsWithType("grass").then((pokemons) => pokemons)


