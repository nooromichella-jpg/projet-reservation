// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importer la connexion MySQL
const db = require('./models/db');

// Importer les routes
const voyagesRoutes = require('./routes/voyages');
const reservationsRoutes = require('./routes/reservations');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static('public'));

// Utiliser les routes
app.use('/api/voyages', voyagesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/admin', adminRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send(' Serveur de réservation de voyages fonctionne !');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
    console.log(` Base de données : reservation_voyage`);
});