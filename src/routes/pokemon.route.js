const express = require('express');
const router = express.Router();

// Importer le controller
const pokemonController = require('../controllers/pokemon.controller');

// Definir les routes
router.get('/liste', pokemonController.ListeDePokemons);
router.post('/', pokemonController.createPokemon);
router.get('/:id', pokemonController.getPokemonById);
router.put('/:id', pokemonController.updatePokemon);
router.delete('/:id', pokemonController.deletePokemon);

module.exports = router;
