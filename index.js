function createElement(tagName, children = [], classes = [], attributes = {}) { // create new element in more comfortable
    const el = document.createElement(tagName); 
    for (let child of children) { // append childs of element
        el.append(child)
    }
    for (let cls of classes) { // add all the classes to the element
        el.classList.add(cls)
    }
    for (let attr in attributes) { // add all attributes to the element
        el.setAttribute(attr , attributes[attr])
    }
    return el
}

async function getPokemon(pokemonName) {
    try {
        const x = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
        return x.data
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
const pokemons = pokemonsWithType("grass").then((pokemons) => pokemons)
const pokemon = getPokemon("Charmeleon")


pokemon.then((pokemon) => {console.log(pokemon)})
.catch((err) => console.log(err.message)) 
console.log("fuck")


             

