// Importation des modules nécessaires et initialisation de l'application Express
const express = require('express');
const dotenv = require('dotenv')
//Créer une application express
const app = express();
// Importer les variables d'environnement
dotenv.config();

// Importation du module swagger-ui-express
const swaggerUi = require('swagger-ui-express');
// Le fichier de documentation JSON, ajustez selon votre projet
const swaggerDocument = require('./src/config/documentation.json');

// Options le l'interface, changez le titre après "customSiteTitle" pour le nom de votre projet 
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};

// Utilisation de Swagger UI Express pour la documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Importer les routes
const pokemonRoutes = require('./src/routes/pokemon.route');

// Importer les MiddleWare
app.use(express.json()); // Middleware pour parser le JSON
app.use('/api/pokemons', pokemonRoutes);

// Démarrage du serveur sur le port spécifié
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
