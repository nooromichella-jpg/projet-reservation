const express = require('express');
const cors = require('cors');

// Importer les routes
const voyagesRouter = require('./voyages'); // ou './routes/voyages' selon l'emplacement de votre fichier
const reservationsRoutes = require('./reservations');
const adminRoutes = require('./admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Utiliser les routes
app.use('/api/voyages', voyagesRouter);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/admin', adminRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('Serveur de réservation de voyages fonctionne !');
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});