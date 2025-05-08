
const NodeCache = require("node-cache");

// Caché con TTL de 1 hora (3600 segundos)
const pokemonCache = new NodeCache({ stdTTL: 3600 });

const getAllPokemons = async (req, res) => {
  try {
    const cachedList = pokemonCache.get("pokemonList");
    if (cachedList) {
      return res.json(cachedList);
    }

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    pokemonCache.set("pokemonList", data.results); // Guardamos en caché
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener Pokémon", error });
  }
};

const getPokemonById = async (req, res) => {
  const { id } = req.params;

  // Revisamos si ya está en caché
  const cachedPokemon = pokemonCache.get(`pokemon_${id}`);
  if (cachedPokemon) {
    return res.json(cachedPokemon);
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    
    if (!response.ok) {
      return res.status(response.status).json({ message: "Error al obtener Pokémon de la API externa" });
    }

    const data = await response.json();

    const pokemon = {
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
    };

    pokemonCache.set(`pokemon_${id}`, pokemon);
    res.json(pokemon);
    console.log(`⏳ Pokémon ${id} no está en caché. Llamando a la API...`);
  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ message: "Error al obtener Pokémon", error });
  }
};

module.exports = {
  getAllPokemons,
  getPokemonById,
};
