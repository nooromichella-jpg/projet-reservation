// public/js/sieges.js
// Gère la sélection des sièges

let voyageId = null;
let siegeSelectionne = null;

document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID du voyage depuis l'URL ou le localStorage
    const urlParams = new URLSearchParams(window.location.search);
    voyageId = urlParams.get('voyageId') || localStorage.getItem('voyageId');
    
    if (!voyageId) {
        alert('Aucun voyage sélectionné. Veuillez recommencer.');
        window.location.href = '/reservation.html';
        return;
    }
    
    chargerSieges(voyageId);
    initConfirmation();
});

async function chargerSieges(voyageId) {
    try {
        // Charger les infos du voyage
        const voyageResponse = await fetch(`/api/voyages/${voyageId}`);
        const voyage = await voyageResponse.json();
        
        // Afficher les infos du voyage
        document.getElementById('destinationDisplay').textContent = 
            `${voyage.depart} → ${voyage.destination}`;
        document.getElementById('voyageDetails').innerHTML = `
            <i class="fas fa-calendar"></i> ${new Date(voyage.date).toLocaleDateString('fr-FR')} 
            <i class="fas fa-clock ms-3"></i> ${voyage.heure.substring(0, 5)}
            <i class="fas fa-euro-sign ms-3"></i> ${voyage.prix} Ar
            <i class="fas fa-chair ms-3"></i> ${voyage.places_disponibles} places disponibles
        `;
        
        // Charger les sièges
        const siegesResponse = await fetch(`/api/reservations/sieges/${voyageId}`);
        const sieges = await siegesResponse.json();
        
        const grid = document.getElementById('siegesGrid');
        grid.innerHTML = '';
        
        sieges.forEach(siege => {
            const btn = document.createElement('button');
            btn.className = `siege ${siege.disponible ? 'disponible' : 'occupe'}`;
            btn.textContent = siege.numero;
            btn.dataset.numero = siege.numero;
            btn.dataset.disponible = siege.disponible;
            
            if (siege.disponible) {
                btn.addEventListener('click', function() {
                    selectionnerSiege(this);
                });
            }
            
            grid.appendChild(btn);
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de chargement des sièges.');
    }
}

function selectionnerSiege(btn) {
    // Désélectionner le précédent
    if (siegeSelectionne) {
        siegeSelectionne.classList.remove('selectionne');
    }
    
    // Sélectionner le nouveau
    btn.classList.add('selectionne');
    siegeSelectionne = btn;
    
    // Activer le bouton de confirmation
    document.getElementById('confirmerBtn').disabled = false;
}

function initConfirmation() {
    const btn = document.getElementById('confirmerBtn');
    if (!btn) return;
    
    btn.addEventListener('click', async function() {
        if (!siegeSelectionne) {
            alert('Veuillez sélectionner un siège.');
            return;
        }
        
        const numeroSiege = parseInt(siegeSelectionne.dataset.numero);
        const nomClient = localStorage.getItem('nomClient');
        const emailClient = localStorage.getItem('emailClient');
        
        if (!nomClient || !emailClient) {
            alert('Informations client manquantes. Veuillez recommencer.');
            window.location.href = '/reservation.html';
            return;
        }
        
        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    voyage_id: parseInt(voyageId),
                    nom_client: nomClient,
                    email_client: emailClient,
                    numero_siege: numeroSiege
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(`Réservation confirmée !\nSiège n°${numeroSiege}\nVoyage confirmé.`);
                // Rediriger vers l'historique
                window.location.href = `/historique.html?email=${encodeURIComponent(emailClient)}`;
            } else {
                alert(` Erreur : ${result.error}`);
            }
            
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la réservation.');
        }
    });
}