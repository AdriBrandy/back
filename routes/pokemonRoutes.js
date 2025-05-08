const express = require('express');
const router = express.Router();
const { getAllPokemons, getPokemonById } = require('../controllers/pokemonController');

router.get('/', getAllPokemons);
router.get("/:id", getPokemonById);

module.exports = router;
