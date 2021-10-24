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
        let pokemon = await axios.get(`http://localhost:8080/pokemon/get/${pokemonName}` , {
                headers: {
                    username: "ziv_serphos",
                }
            })
        //pokemon = await pokemon.json()
        return pokemon.data
    }
    catch {
        throw new Error("NOT FOUND")
    }
}

async function ninePokemons() {
    let pokemons = await axios.get(`http://localhost:8080/pokemon/getPokemonsList/9/${next}` , {
        headers: {
            username: "ziv_serphos"
        }
    })
    pokemons = pokemons.data
    for(let i=0; i<pokemons.length; i++) {
        pokemons[i] = await getPokemon(pokemons[i])
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

async function changePokemon(event){
    const pokemonName = event.target.textContent
    const pokemon = await getPokemon(pokemonName)
    closePokemonInfo()
    document.querySelector(".modal-body").append(pokemonDetailsEl(pokemon))
    document.getElementById("showPokemonDetails").style.display = "flex"
    
}

function closePokemonInfo() {
    document.getElementById("showPokemonDetails").style.display = "none"
    document.getElementById("currentUl").remove()
    const allTypeLists = Array.from(document.querySelectorAll(".dropdown-menu"))
    allTypeLists.forEach((ul) => {
        ul.closest('div').remove()})
}

async function dropupType(typeName) {
    const pokemonWithType = await axios.get(`http://localhost:8080/pokemon/getTypeByName/water` , {
        headers: {
            username: "ziv_serphos"
        }
    })
    const typeUl = document.getElementById(typeName)
    pokemonWithType.data.forEach((name) => typeUl.append(createElement("li" , [name] , ["dropdown-item"] , {onclick: "changePokemon(event)"})))
}

function pokemonDetailsEl(pokemon){
    console.log(pokemon)
    const weight = createElement("li" , [`pokemon weight: ${pokemon.weight}`] , ["weightHeight"])
    const height = createElement("li" , [`pokemon height: ${pokemon.height}`] , ["weightHeight"])
    const img = createElement("img" , [] , ["pokemonImg"] , {src: `${pokemon.frontImg}`, frontImg: pokemon.frontImg ,backImg: pokemon.backImg , onmouseover: "whenHover(event)" , onmouseleave: "whenLeave(event)"})
    document.querySelector(".modal-title").textContent = pokemon.name
    const ul = createElement("ul" , [weight,height,img] , [] , {id: "currentUl"})
    pokemon.types.forEach((type) => {
        const typeName = type
        const typeList = createElement("button" ,[typeName] , ["btn" , "btn-secondary"  , "dropdown-toggle"], {onclick: "showCloseList(event)"})
        typeList.setAttribute("data-typeName" , typeName)
        const ul = createElement("ul" , [] , ["dropdown-menu"] , {id:typeName})
        dropupType(typeName)
        const div = createElement("div" , [typeList ,ul] ,["btn-group" ,"dropup"])
        document.querySelector(".modal-footer").prepend(div)
    })
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
    const input = document.getElementById("pokemonInput").value.toLowerCase()
    const pokemon = await getPokemon(input)
    document.querySelector(".modal-body").append(pokemonDetailsEl(pokemon))
    document.getElementById("showPokemonDetails").style.display = "flex"
}

ninePokemons().then((pokemons) => presenetPokemons(pokemons))
document.getElementById("search-addon").addEventListener("click" , (event) => searchPokemon(event))
document.querySelector(".close").addEventListener("click" , (event) =>closePokemonInfo(event))

function showCloseList(event){
    const pokemonList = document.getElementById(event.target.dataset.typename)
    if(pokemonList.dataset.display === "none") {
        pokemonList.setAttribute("data-display" , "flex")
        pokemonList.style.display = "flex"
        return;
    }
    pokemonList.setAttribute("data-display" , "none")
    pokemonList.style.display = "none"
}



















/* pokemon.then((pokemon) => {
    const name = createElement("li" , [])
    const ul = createElement("ul" , [] , [] , {src: `${pokemon[4]}`})
    document.getElementById("pok1").append(img)
}) */
