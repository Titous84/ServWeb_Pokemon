// pokemon.model.js
const pool = require('../config/db');


// Ajouter un pokemon
exports.addPokemon = (pokemonData, callback) => {
    const { nom, type_primaire, type_secondaire, pv, attaque, defense } = pokemonData;
    const sql = 'INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES ($1, $2, $3, $4, $5, $6)';
    pool.query(sql, [nom, type_primaire, type_secondaire, pv, attaque, defense], function(err, results) {
        callback(err, results);
    });
};

// Trouver un pokemon
exports.findPokemonById = (id, callback) => {
    pool.query('SELECT * FROM pokemons WHERE id = ?', [id], function(err, results) {
        callback(err, results);
    });
};


// Modifier un Pokemon
exports.updatePokemonById = (id, pokemonData, callback) => {
    const { nom, type_primaire, type_secondaire, pv, attaque, defense } = pokemonData;
    const sql = `UPDATE pokemons SET nom = ?, type_primaire = ?, type_secondaire = ?, pv = ?, attaque = ?, defense = ? WHERE id = ?`;
    pool.query(sql, [nom, type_primaire, type_secondaire, pv, attaque, defense, id], function(err, results) {
        callback(err, results);
    });
};

// Obtenir une liste paginée des pokemons
exports.getPokemonsPaginated = (type, pageSize, offset, callback) => {
    let queryParams = [];
    let baseQuery = 'SELECT * FROM pokemons';
    let countQuery = 'SELECT COUNT(*) AS count FROM pokemons';
    
    if (type) {
        baseQuery += ' WHERE type_primaire = ?';
        countQuery += ' WHERE type_primaire = ?';
        queryParams.push(type);
    }

    baseQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(pageSize, offset);

    pool.query(countQuery, queryParams.slice(0, 1), (err, countResults) => {
        if (err) {
            return callback(err, null);
        }

        pool.query(baseQuery, queryParams, (err, results) => {
            if (err) {
                return callback(err, null);
            }

            const totalPokemons = countResults[0].count;
            const totalPages = Math.ceil(totalPokemons / pageSize);
            callback(null, { results, totalPokemons, totalPages });
        });
    });
};

// Supprimer un pokemon : 
exports.deletePokemonById = (id, callback) => {
    const sql = 'DELETE FROM pokemons WHERE id = ?';
    pool.query(sql, [id], function(err, results) {
        callback(err, results);
    });
};
