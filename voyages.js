// routes/voyages.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Récupérer tous les voyages
router.get('/', (req, res) => {
    db.query('SELECT * FROM voyages ORDER BY date ASC', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des voyages' });
        }
        res.json(results);
    });
});

// Récupérer un voyage par ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM voyages WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du voyage' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Voyage non trouvé' });
        }
        res.json(results[0]);
    });
});

// Ajouter un voyage (pour l'admin)
router.post('/', (req, res) => {
    const { destination, depart, date, heure, prix, capacite, places_disponibles } = req.body;
    
    // Vérifier que tous les champs sont présents
    if (!destination || !depart || !date || !heure || !prix || !capacite || !places_disponibles) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const sql = `INSERT INTO voyages (destination, depart, date, heure, prix, capacite, places_disponibles) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [destination, depart, date, heure, prix, capacite, places_disponibles], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de l\'ajout du voyage' });
        }
        res.status(201).json({ message: 'Voyage ajouté avec succès', id: result.insertId });
    });
});

module.exports = router;