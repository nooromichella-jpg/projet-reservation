// public/js/reservation.js
// Gère le formulaire de réservation

document.addEventListener('DOMContentLoaded', function() {
    chargerVoyagesSelect();
    initForm();
});

async function chargerVoyagesSelect() {
    try {
        const response = await fetch('/api/voyages');
        const voyages = await response.json();
        
        const select = document.getElementById('voyageSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">Sélectionnez un voyage...</option>';
        
        voyages.forEach(voyage => {
            const option = document.createElement('option');
            option.value = voyage.id;
            option.textContent = `${voyage.depart} → ${voyage.destination} (${new Date(voyage.date).toLocaleDateString('fr-FR')} - ${voyage.heure.substring(0, 5)}) - ${voyage.prix}Ar`;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de charger la liste des voyages. Vérifiez que le serveur est lancé.');
    }
}

function initForm() {
    const form = document.getElementById('reservationForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const voyageId = document.getElementById('voyageSelect').value;
        const nomClient = document.getElementById('nomClient').value.trim();
        const emailClient = document.getElementById('emailClient').value.trim();
        
        if (!voyageId) {
            alert('Veuillez sélectionner un voyage.');
            return;
        }
        if (!nomClient) {
            alert('Veuillez entrer votre nom.');
            return;
        }
        if (!emailClient) {
            alert('Veuillez entrer votre email.');
            return;
        }
        
        // Sauvegarder les infos du client dans le localStorage pour les utiliser sur la page sièges
        localStorage.setItem('voyageId', voyageId);
        localStorage.setItem('nomClient', nomClient);
        localStorage.setItem('emailClient', emailClient);
        
        // Rediriger vers la page de sélection des sièges
        window.location.href = `/sieges.html?voyageId=${voyageId}`;
    });
}