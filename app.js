// public/js/app.js
// Charge les voyages sur la page d'accueil

document.addEventListener('DOMContentLoaded', function() {
    chargerVoyages();
});

async function chargerVoyages() {
    try {
        const response = await fetch('/api/voyages');
        const voyages = await response.json();
        
        const container = document.getElementById('voyagesList');
        if (!container) return;
        
        if (voyages.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center text-muted">
                    <i class="fas fa-bus fa-3x mb-3"></i>
                    <p>Aucun voyage disponible pour le moment.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = voyages.map(voyage => `
            <div class="col-md-4">
                <div class="card h-100 shadow-sm hover-card">
                    <div class="card-body">
                        <h5 class="card-title text-primary">
                            <i class="fas fa-map-marker-alt"></i> ${voyage.destination}
                        </h5>
                        <p class="card-text">
                            <i class="fas fa-location-dot"></i> <strong>Départ :</strong> ${voyage.depart}<br>
                            <i class="fas fa-calendar"></i> <strong>Date :</strong> ${new Date(voyage.date).toLocaleDateString('fr-FR')}<br>
                            <i class="fas fa-clock"></i> <strong>Heure :</strong> ${voyage.heure.substring(0, 5)}<br>
                            <i class="fas fa-euro-sign"></i> <strong>Prix :</strong> ${voyage.prix} Ar<br>
                            <i class="fas fa-chair"></i> <strong>Places :</strong> ${voyage.places_disponibles}/${voyage.capacite}
                        </p>
                        <a href="/reservation.html" class="btn btn-primary btn-sm w-100">
                            <i class="fas fa-ticket"></i> Réserver
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erreur:', error);
        const container = document.getElementById('voyagesList');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center text-danger">
                    <i class="fas fa-exclamation-circle fa-2x"></i>
                    <p>Erreur de chargement des voyages. Vérifiez que le serveur est lancé.</p>
                </div>
            `;
        }
    }
}