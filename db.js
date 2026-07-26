// models/db.js
const mysql = require('mysql2');

// Créer la connexion
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Par défaut sous XAMPP
    password: '',        // Par défaut sous XAMPP (vide)
    database: 'reservation_voyage'
});

// Se connecter
connection.connect((err) => {
    if (err) {
        console.error(' Erreur de connexion à MySQL :', err);
        return;
    }
    console.log(' Connecté à MySQL (base: reservation_voyage)');
});

module.exports = connection;