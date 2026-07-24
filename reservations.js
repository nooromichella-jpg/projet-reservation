// routes/reservations.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Créer une réservation
router.post('/', (req, res) => {
    const { voyage_id, nom_client, email_client, numero_siege } = req.body;

    // Vérifier les champs requis
    if (!voyage_id || !nom_client || !email_client || !numero_siege) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifier que le voyage existe
    db.query('SELECT * FROM voyages WHERE id = ?', [voyage_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la vérification du voyage' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Voyage non trouvé' });
        }

        const voyage = results[0];
        if (voyage.places_disponibles <= 0) {
            return res.status(400).json({ error: 'Plus de places disponibles pour ce voyage' });
        }

        // Vérifier que le siège n'est pas déjà pris
        db.query('SELECT * FROM reservations WHERE voyage_id = ? AND numero_siege = ?', [voyage_id, numero_siege], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la vérification du siège' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Ce siège est déjà réservé' });
            }

            // Créer la réservation
            const sql = `INSERT INTO reservations (voyage_id, nom_client, email_client, numero_siege) 
                         VALUES (?, ?, ?, ?)`;
            db.query(sql, [voyage_id, nom_client, email_client, numero_siege], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de la réservation' });
                }

                // Mettre à jour les places disponibles
                db.query('UPDATE voyages SET places_disponibles = places_disponibles - 1 WHERE id = ?', [voyage_id]);

                res.status(201).json({ 
                    message: 'Réservation effectuée avec succès', 
                    reservationId: result.insertId 
                });
            });
        });
    });
});

// Récupérer l'historique d'un client par email
router.get('/historique/:email', (req, res) => {
    const { email } = req.params;
    const sql = `
        SELECT r.*, v.destination, v.depart, v.date, v.heure 
        FROM reservations r 
        JOIN voyages v ON r.voyage_id = v.id 
        WHERE r.email_client = ? 
        ORDER BY r.date_reservation DESC
    `;
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
        }
        res.json(results);
    });
});

// Récupérer les sièges disponibles pour un voyage
router.get('/sieges/:voyage_id', (req, res) => {
    const { voyage_id } = req.params;
    
    // Récupérer les sièges réservés
    db.query('SELECT numero_siege FROM reservations WHERE voyage_id = ?', [voyage_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des sièges' });
        }
        
        // Récupérer la capacité du voyage
        db.query('SELECT capacite FROM voyages WHERE id = ?', [voyage_id], (err, voyageResult) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la récupération du voyage' });
            }
            if (voyageResult.length === 0) {
                return res.status(404).json({ error: 'Voyage non trouvé' });
            }

            const capacite = voyageResult[0].capacite;
            const siegesReserves = results.map(r => r.numero_siege);
            
            // Générer la liste de tous les sièges avec leur statut
            const sieges = [];
            for (let i = 1; i <= capacite; i++) {
                sieges.push({
                    numero: i,
                    disponible: !siegesReserves.includes(i)
                });
            }
            
            res.json(sieges);
        });
    });
});

module.exports = router;