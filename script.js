const d = document,
  $main = d.querySelector("main"),
  $template = d.getElementById("pokedex").content,
  $link = d.querySelector(".link"),
  $linksPokedex = d.querySelector(".links"),
  $fragment = d.createDocumentFragment();


//async trycatch

async function loadPokemon(url) {
  try {
    let res = await fetch(url),
      json = await res.json();

    $prevLink = json.previous ? `<a id="previousPokemon" href="${json.previous}"> <= </a>` : "";
    $nextLink = json.next ? `<a id="nextPokemon" href="${json.next}"> => </a>` : "";
    $link.innerHTML = $prevLink + " " + $nextLink;

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      
      try {

        let res = await fetch(json.results[i].url),
          pokemonJson = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        $template.querySelector("img").src = pokemonJson.sprites.front_default;
        $template.querySelector("img").alt = pokemonJson.name;
        $template.querySelector("figcaption").innerHTML = "#" + pokemonJson.id + " " + pokemonJson.name;

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone)

      } catch (err) { };
    }
    $main.appendChild($fragment);

  } catch (err) {
    console.log(err);
    let message = err.statusText || "Ocurrio un error";
    $main.innerHTML = `<p>Error ${err.status} : ${message}`;
  }
}

async function loadPokedex(url) {
  try {
    let res2 = await fetch(url),
      json2 = await res2.json();

    $prevPokedex = json2.previous ? `<a id="prevPokedex" href="${json2.previous}"> <== </a>"` : "";
    $nextPokedex = json2.next ? `<a id="nextPokedex" href="${json2.next}"> ==> </a>`: "" ;       
    $linksPokedex.innerHTML = $prevPokedex + " " + $nextPokedex;

    if (!res2.ok) throw { status: res2.status, statusText: res2.statusText };

    for (let i = 0; i < json2.results.length ; i++) {
      
      try {

        let res = await fetch(json2.results[i].url),
        pokedexJson = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        
        $template.querySelector("#pokedexText").innerHTML = "";
        $template.querySelector("#pokedexText").innerHTML = `${i} ${pokedexJson.flavor_text_entries[8].flavor_text}`;
        console.log(pokedexJson.flavor_text_entries[1].flavor_text, pokedexJson.name);

        
      } catch (error) {

      }
    }
  } catch (error) {

  }
}




d.addEventListener("DOMContentLoaded", (e) =>
  loadPokemon("https://pokeapi.co/api/v2/pokemon/"),
  loadPokedex("https://pokeapi.co/api/v2/pokemon-species/"),
);

d.addEventListener("click", e => {
  if(e.target.matches(".link #nextPokemon")) {
    e.preventDefault();
    $main.innerHTML = "";
    loadPokemon(e.target.getAttribute("href"));
    loadPokedex(d.querySelector("#nextPokedex").getAttribute("href"));
  }

  if(e.target.matches(".link #previousPokemon")) {
    e.preventDefault();
    $main.innerHTML = "";
    loadPokemon(e.target.getAttribute("href"));
    loadPokedex(d.querySelector("#prevPokedex").getAttribute("href"));
  }
})

