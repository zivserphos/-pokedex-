let next = 0;
let currentUser = "avi"

function createElement(tagName, children = [], classes = [], attributes = {}) {
  // create new element in more comfortable
  const el = document.createElement(tagName);
  for (let child of children) {
    // append childs of element
    el.append(child);
  }
  for (let cls of classes) {
    // add all the classes to the element
    el.classList.add(cls);
  }
  for (let attr in attributes) {
    // add all attributes to the element
    el.setAttribute(attr, attributes[attr]);
  }
  return el;
}

async function getPokemon(pokemonName) {
  try {
    let pokemon = await axios.get(
      `http://localhost:8080/pokemon/get/${pokemonName}`,
      {
        headers: {
          username: currentUser,
        },
      }
    );
    return pokemon.data;
  } catch {
    throw new Error("NOT FOUND");
  }
}

function submitUserName(event) {
   const userDiv = event.target.closest("div")
   currentUser = userDiv.children[0].value;
   return dropupPokedex();
}
document.getElementById("submit").addEventListener("click" , submitUserName)

async function catchPokemon(event) {
  const pokemonId = Number(event.target.dataset.id);
  if(currentUser === "avi") {
    throw Error("YOU HAVE TO LOG IN BEFORE CATCH POKEMONS!")
  }
  try {
    await axios.put(
      `http://localhost:8080/pokemon/catch/${pokemonId}`,
      {},
      {
        headers: {
          username: currentUser,
        },
      }
    );
    dropupPokedex()
  } catch (err) {
    console.log(err.response.data);
  }
}

async function ninePokemons() {
  let pokemons = await axios.get(
    `http://localhost:8080/pokemon/getPokemonsList/9/${next}`,
    {
      headers: {
        username: currentUser,
      },
    }
  );
  pokemons = pokemons.data;
  for (let i = 0; i < pokemons.length; i++) {
    let details = await getPokemon(pokemons[i]);
    pokemons[i] = {
      id: details.id,
      frontImg: details.frontImg,
    };
  }
  return pokemons;
}

async function presenetPokemons(pokemons) {
  for (i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    const img = createElement("img", [], [], { src: `${pokemon.frontImg}` });
    const catchImg = createElement("img", [], ["catchPokemon"], {
      src: "imgaes/catch_pokemon.png",
      "data-id": pokemon.id,
      onclick: "catchPokemon(event)",
    });
    const pokEl = document.getElementById(`pok${i + 1}`);
    pokEl.textContent = ``;
    pokEl.append(img, catchImg);
  }
}

async function nextPokemons() {
  next += 9;
  const pokemons = await ninePokemons();
  presenetPokemons(pokemons);
}

async function previousPokemons() {
  if (next > 8) {
    next -= 9;
  }
  const pokemons = await ninePokemons();
  presenetPokemons(pokemons);
}

async function changePokemon(event) {
  const pokemonName = event.target.textContent;
  const pokemon = await getPokemon(pokemonName);
  closePokemonInfo();
  document.querySelector(".modal-body").append(pokemonDetailsEl(pokemon));
  document.getElementById("showPokemonDetails").style.display = "flex";
}

function closePokemonInfo() {
  document.getElementById("showPokemonDetails").style.display = "none";
  document.getElementById("currentUl").remove();
  const allTypeLists = Array.from(document.querySelectorAll(".allTypes"));
  allTypeLists.forEach((ul) => {
    ul.closest("div").remove();
  });
}

async function dropupType(typeName) {
  const pokemonWithType = await axios.get(
    `http://localhost:8080/pokemon/getTypeByName/water`,
    {
      headers: {
        username: currentUser,
      },
    }
  );
  const typeUl = document.getElementById(typeName);
  pokemonWithType.data.forEach((name) =>
    typeUl.append(
      createElement("li", [name], ["dropdown-item"], {
        onclick: "changePokemon(event)",
      })
    )
  );
}
async function dropupPokedex() {
  const pokemonList = await axios.get(`http://localhost:8080/pokemon/getPokedex`, {
    headers: {
      username: currentUser,
    },
  });
  if (!pokemonList){
    throw Error("you dont have any catched pokemons")
  }
  const ul = document.getElementById("pokedexList")
  ul.innerHTML = ""
  pokemonList.data.forEach((name) => ul.append(createElement("li" , [name] , ["dropdown-item"])))
 
}


function pokemonDetailsEl(pokemon) {
  console.log(pokemon);
  const weight = createElement(
    "li",
    [`pokemon weight: ${pokemon.weight}`],
    ["weightHeight"]
  );
  const height = createElement(
    "li",
    [`pokemon height: ${pokemon.height}`],
    ["weightHeight"]
  );
  const img = createElement("img", [], ["pokemonImg"], {
    src: `${pokemon.frontImg}`,
    frontImg: pokemon.frontImg,
    backImg: pokemon.backImg,
    onmouseover: "whenHover(event)",
    onmouseleave: "whenLeave(event)",
  });
  const catchImg = createElement("img", [], ["catchPokemon"], {
    src: "imgaes/catch_pokemon.png",
    "data-id": pokemon.id,
    onclick: "catchPokemon(event)",
  });
  document.querySelector(".modal-title").textContent = pokemon.name;
  const ul = createElement("ul", [weight, height, img, catchImg], [], {
    id: "currentUl",
  });
  pokemon.types.forEach((type) => {
    const typeName = type;
    const typeList = createElement(
      "button",
      [typeName],
      ["btn", "btn-secondary", "dropdown-toggle"],
      { onclick: "showCloseList(event)" }
    );
    typeList.setAttribute("data-identify", typeName);
    const ul = createElement("ul", [], ["dropdown-menu" , "allTypes"], { id: typeName });
    dropupType(typeName);
    const div = createElement("div", [typeList, ul], ["btn-group", "dropup"]);
    document.querySelector(".modal-footer").prepend(div);
  });
  return ul;
}

function whenHover(event) {
  const backImg = event.target.getAttribute("backImg");
  event.target.setAttribute("src", backImg);
}

function whenLeave(event) {
  const frontImg = event.target.getAttribute("frontImg");
  event.target.setAttribute("src", frontImg);
}

async function searchPokemon(event) {
  const input = document.getElementById("pokemonInput").value.toLowerCase();
  const pokemon = await getPokemon(input);
  document.querySelector(".modal-body").append(pokemonDetailsEl(pokemon));
  document.getElementById("showPokemonDetails").style.display = "flex";
}

ninePokemons().then((pokemons) => presenetPokemons(pokemons));
document
  .getElementById("search-addon")
  .addEventListener("click", (event) => searchPokemon(event));
document
  .querySelector(".close")
  .addEventListener("click", (event) => closePokemonInfo(event));

function showCloseList(event) {
  if (currentUser === "avi") {
    throw Error("YOU NEED TO LOGIN IN FIRST")
  }
  const pokemonList = document.getElementById(event.target.dataset.identify);
  console.log(pokemonList)
  if (pokemonList.dataset.display === "none") {
    pokemonList.setAttribute("data-display", "flex");
    pokemonList.style.display = "flex";
    return;
  }
  pokemonList.setAttribute("data-display", "none");
  pokemonList.style.display = "none";
}

