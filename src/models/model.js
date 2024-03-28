const sql = require("../config/db_pg");


// Trouver un pokemon
exports.findPokemonById = (id, callback) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE id = $1';
        const parametres = [id];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }

            resolve(resultat.rows);
        });
    });
};

// Ajouter un pokemon
exports.addPokemon = (pokemonData) => {
    return new Promise((resolve, reject) => {
        const { nom, type_primaire, type_secondaire, pv, attaque, defense } = pokemonData;
        const requete = 'INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES ($1, $2, $3, $4, $5, $6)';
        const parametres = [nom, type_primaire, type_secondaire, pv, attaque, defense];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur lors de l\'ajout du pokemon:', erreur);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

exports.updatePokemonById = (id, pokemonData) => {
    return new Promise((resolve, reject) => {
        const { nom, type_primaire, type_secondaire, pv, attaque, defense } = pokemonData;
        const requete = 'UPDATE pokemon SET nom = $1, type_primaire = $2, type_secondaire = $3, pv = $4, attaque = $5, defense = $6 WHERE id = $7';
        const parametres = [nom, type_primaire, type_secondaire, pv, attaque, defense, id];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur lors de la mise à jour du pokemon:', erreur);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};

exports.getPokemonsPaginated = (type, pageSize, offset) => {
    return new Promise((resolve, reject) => {
        let queryParams = [];
        let baseQuery = 'SELECT * FROM pokemon';
        let countQuery = 'SELECT COUNT(*) AS count FROM pokemon';
        
        if (type) {
            baseQuery += ' WHERE type_primaire = $1';
            countQuery += ' WHERE type_primaire = $1';
            queryParams.push(type);
        }

        queryParams.push(pageSize);
        queryParams.push(offset);

        sql.query(countQuery, queryParams.slice(0, 1), (err, countResults) => {
            if (err) {
                reject(err);
            } else {
                sql.query(baseQuery + ' LIMIT $2 OFFSET $3', queryParams, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        const totalPokemons = countResults.rows[0].count;
                        const totalPages = Math.ceil(totalPokemons / pageSize);
                        resolve({ results: results.rows, totalPokemons, totalPages });
                    }
                });
            }
        });
    });
};

exports.deletePokemonById = (id) => {
    return new Promise((resolve, reject) => {
        const requete = 'DELETE FROM pokemon WHERE id = $1';
        const parametres = [id];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur lors de la suppression du pokemon:', erreur);
                reject(erreur);
            }
            resolve(resultat);
        });
    });
};
