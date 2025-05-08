require("dotenv").config();
const NodeCache = require("node-cache");

const POKEAPI_URL = process.env.POKEAPI_URL;

const pokemonCache = new NodeCache({ stdTTL: 3600 });

const getAllPokemons = async (req, res) => {
  try {
    const cachedList = pokemonCache.get("pokemonList");
    if (cachedList) {
      return res.json(cachedList);
    }

    const response = await fetch(`${POKEAPI_URL}?limit=151`);
    const data = await response.json();
    pokemonCache.set("pokemonList", data.results);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener Pokémon", error });
  }
};

const getPokemonById = async (req, res) => {
  const { id } = req.params;

  const cachedPokemon = pokemonCache.get(`pokemon_${id}`);
  if (cachedPokemon) {
    return res.json(cachedPokemon);
  }

  try {
    const response = await fetch(`${POKEAPI_URL}/${id}`);
    
    if (!response.ok) {
      return res.status(response.status).json({ message: "Error al obtener Pokémon de la API externa" });
    }

    const data = await response.json();

    const pokemon = {
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types,
      abilities: data.abilities,
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