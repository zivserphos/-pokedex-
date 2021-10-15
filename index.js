let next =0;

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
const pokemons = pokemonsWithType("grass").then((pokemons) => pokemons)
const pokemon = getPokemon("charmeleon")

async function ninePokemons() {
    const pokemons = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=9&offset=${next}`)
    for(i=0; i<pokemons.length; i++) {
        console.log("22")
        const pokemonData = await getPokemon(pokemons[i].name)
        console.log(pokemonData)
    }
    return pokemons.data.results
}

async function presenetPokemons(pokemons) {

    for(i=0; i<pokemons.length; i++) {
        const pokemon = await getPokemon(pokemons[i].name)
        const img = createElement("img" , [] , [] , {src: `${pokemon[4]}`})
        const pokEl = document.getElementById(`pok${i+1}`)
        pokEl.textContent = ``
        pokEl.append(img)
    }
    next+=9;
}

async function nextPokemons(){
    console.log("@")
    const pokemons = await ninePokemons()
    presenetPokemons(pokemons)
}

ninePokemons().then((pokemons) => presenetPokemons(pokemons))
//document.getElementById("next").addEventListener("click" , nextPokemons())
console.log("22")






















/* pokemon.then((pokemon) => {
    const name = createElement("li" , [])
    const ul = createElement("ul" , [] , [] , {src: `${pokemon[4]}`})
    document.getElementById("pok1").append(img)
}) */



             

