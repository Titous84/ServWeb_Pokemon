const PokemonModel = require('../models/model');

// Création d'un nouveau Pokemon
/* localhost:10007/api/pokemons */
exports.createPokemon = (req, res) => {
    const { nom, type_primaire, type_secondaire, pv, attaque, defense } = req.body;

    // Valider les données reçues
    let champsManquants = [];
    if (!nom) champsManquants.push('nom');
    if (!type_primaire) champsManquants.push('type_primaire');
    // Ajouter des vérifications pour tous les champs requis...

    if (champsManquants.length) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champ_manquant: champsManquants
        });
    }

    // Créer un objet avec les données validées
    const pokemonData = { nom, type_primaire, type_secondaire, pv, attaque, defense };

    // Appeler le modèle pour ajouter le Pokémon
    PokemonModel.addPokemon(pokemonData, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erreur: `Echec lors de la création du pokemon ${nom}` });
        }

        // Renvoyer le résultat avec le nouvel ID du Pokémon
        const newId = results.insertId;
        res.status(201).json({
            message: `Le pokemon ${nom} a été ajouté avec succès`,
            pokemon: { id: newId, ...pokemonData }
        });
    });
};

// Afficher un pokemon selon son id
/* localhost:10007/api/pokemons/47 */
exports.getPokemonById = (req, res) => {
    const id = req.params.id;

    PokemonModel.findPokemonById(id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erreur: `Echec lors de la récupération du pokemon avec l'id ${id}` });
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ erreur: `Pokemon introuvable avec l'id ${id}` });
        }
    });
};

// Modifier un pokemon : 
/* localhost:10007/api/pokemons/1074 */
exports.updatePokemon = (req, res) => {
    const id = req.params.id;
    const { nom, type_primaire, type_secondaire, pv, attaque, defense } = req.body;
    
    // Valider les données ici...
    let champsManquants = [];
    if (!nom) champsManquants.push('nom');
    if (!type_primaire) champsManquants.push('type_primaire');
    // Ajouter des vérifications pour tous les champs requis...

    if (champsManquants.length > 0) {
        // S'il manque des champs, renvoyer une erreur
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champ_manquant: champsManquants
        });
    }

    // Données validées, appeler le modèle pour la mise à jour
    PokemonModel.updatePokemonById(id, { nom, type_primaire, type_secondaire, pv, attaque, defense }, (err, results) => {
        if (err) {
            // Gérer les erreurs SQL ici...
            console.error(err);
            return res.status(500).json({ erreur: `Echec lors de la modification du pokemon ${nom}` });
        }
        if (results.affectedRows === 0) {
            // Gérer le cas où le Pokémon n'existe pas...
            return res.status(404).json({ erreur: `Le pokemon id ${id} n'existe pas dans la base de données` });
        } else {
            // Réponse de succès avec la mise à jour des informations du Pokémon
            res.status(200).json({
                message: `Le pokemon id ${id} a été modifié avec succès`,
                pokemon: { id, nom, type_primaire, type_secondaire, pv, attaque, defense }
            });
        }
    });
};

// Obtenir une liste paginée des pokemons :
/* localhost:10007/api/pokemons/liste?page=3&type=fire */
exports.ListeDePokemons = (req, res) => {
    let page = parseInt(req.query.page, 10) || 1;
    let type = req.query.type || '';
    let pageSize = 25;
    let offset = (page - 1) * pageSize;

    PokemonModel.getPokemonsPaginated(type, pageSize, offset, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erreur: "Echec lors de la récupération de la liste des pokemons" });
        }

        res.status(200).json({
            pokemons: data.results,
            type: type,
            nombrePokemonTotal: data.totalPokemons,
            page: page,
            totalPage: data.totalPages
        });
    });
};

// Supprimer un pokemon
/* localhost:10007/api/pokemons/107 */
exports.deletePokemon = (req, res) => {
    const id = req.params.id;

    PokemonModel.deletePokemonById(id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erreur: "Echec lors de la suppression du pokemon" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ erreur: `Le pokemon id ${id} n'existe pas dans la base de données` });
        } else {
            res.status(200).json({
                message: `Le pokemon id ${id} a été supprimé avec succès`,
                pokemon: { id: parseInt(id) } // Vous pouvez choisir de ne pas renvoyer les détails ici
            });
        }
    });
};
