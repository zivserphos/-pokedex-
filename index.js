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
const pokemonData = (pokemon) => {
    const dataPokemon = {
        name: pokemon.name,
        weight: pokemon.weight,
        height: pokemon.height,
        frontImg: pokemon.sprites.front_default,
        backImg: pokemon.sprites.back_default,
        type: pokemon.types,
    }
    return dataPokemon
}
const pokemons = pokemonsWithType("grass").then((pokemons) => pokemons)

async function ninePokemons() {
    let pokemons = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=9&offset=${next}`)
    pokemons = pokemons.data.results;
    for(let i=0; i<pokemons.length; i++) {
        pokemons[i] = await getPokemon(pokemons[i].name)
    }
    return pokemons
}

async function presenetPokemons(pokemons) {
    for(i=0; i<pokemons.length; i++) {
        const pokemon = pokemons[i]
        const img = createElement("img" , [] , [] , {src: `${pokemon.frontImg}`})
        const pokEl = document.getElementById(`pok${i+1}`)
        pokEl.textContent = ``
        pokEl.append(img)
    }
}

async function nextPokemons(){
    next+=9;
    const pokemons = await ninePokemons()
    presenetPokemons(pokemons)
}

async function previousPokemons() {
    if (next>8) {
        next-=9
    }
    const pokemons = await ninePokemons()
    presenetPokemons(pokemons)
}

function pokemonDetailsEl(pokemon){
    const name = createElement("li" , [pokemon.name])
    const weight = createElement("li" , [pokemon.weight])
    const height = createElement("li" , [pokemon.height])
    console.log(pokemon.backImg)
    const img = createElement("img" , [] , ["pokemonImg"] , {src: `${pokemon.frontImg}`, frontImg: pokemon.frontImg ,backImg: pokemon.backImg , onmouseover: "whenHover(event)" , onmouseleave: "whenLeave(event)"})
    const ul = createElement("ul" , [name,weight,height,img])
    return ul
}

function whenHover(event) {
    const backImg = event.target.getAttribute("backImg")
    event.target.setAttribute("src" , backImg)
}

function whenLeave(event) {
    const frontImg = event.target.getAttribute("frontImg")
    event.target.setAttribute("src" , frontImg)
}

async function searchPokemon(event) {
    const input = document.getElementById("pokemonInput")
    const pokemon = await getPokemon(input.value)
    document.querySelector(".modal-body").append(pokemonDetailsEl(pokemon))
    document.getElementById("showPokemonDetails").style.display = "flex"
}

ninePokemons().then((pokemons) => presenetPokemons(pokemons))
document.getElementById("search-addon").addEventListener("click" , (event) => searchPokemon(event))
























/* pokemon.then((pokemon) => {
    const name = createElement("li" , [])
    const ul = createElement("ul" , [] , [] , {src: `${pokemon[4]}`})
    document.getElementById("pok1").append(img)
}) */



             

