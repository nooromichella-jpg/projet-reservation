// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Vérifier l'admin (login)
router.post('/login', (req, res) => {
    const { email, mot_de_passe } = req.body;
    
    if (!email || !mot_de_passe) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    db.query('SELECT * FROM admins WHERE email = ? AND mot_de_passe = ?', [email, mot_de_passe], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la connexion' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        res.json({ message: 'Connexion réussie', admin: { id: results[0].id, email: results[0].email } });
    });
});

// Récupérer toutes les réservations (pour le dashboard)
router.get('/reservations', (req, res) => {
    const sql = `
        SELECT r.*, v.destination, v.depart, v.date, v.heure 
        FROM reservations r 
        JOIN voyages v ON r.voyage_id = v.id 
        ORDER BY r.date_reservation DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
        }
        res.json(results);
    });
});

// Récupérer les statistiques pour le dashboard
router.get('/stats', (req, res) => {
    const stats = {};
    
    // Nombre total de voyages
    db.query('SELECT COUNT(*) as total FROM voyages', (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur lors du comptage des voyages' });
        stats.totalVoyages = result[0].total;
        
        // Nombre total de réservations
        db.query('SELECT COUNT(*) as total FROM reservations', (err, result) => {
            if (err) return res.status(500).json({ error: 'Erreur lors du comptage des réservations' });
            stats.totalReservations = result[0].total;
            
            // Réservations du jour
            db.query('SELECT COUNT(*) as total FROM reservations WHERE DATE(date_reservation) = CURDATE()', (err, result) => {
                if (err) return res.status(500).json({ error: 'Erreur lors du comptage des réservations du jour' });
                stats.reservationsToday = result[0].total;
                
                res.json(stats);
            });
        });
    });
});

module.exports = router;