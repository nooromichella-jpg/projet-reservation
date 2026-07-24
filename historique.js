// public/js/historique.js
// Affiche l'historique des réservations

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
        document.getElementById('emailHistorique').value = email;
        chargerHistorique(email);
    }
    
    initForm();
});

function initForm() {
    const form = document.getElementById('historiqueForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('emailHistorique').value.trim();
        
        if (!email) {
            alert('Veuillez entrer votre email.');
            return;
        }
        
        chargerHistorique(email);
    });
}

async function chargerHistorique(email) {
    const container = document.getElementById('historiqueResultats');
    container.innerHTML = `
        <div class="text-center text-muted">
            <i class="fas fa-spinner fa-spin fa-2x"></i>
            <p>Chargement de votre historique...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`/api/reservations/historique/${encodeURIComponent(email)}`);
        const reservations = await response.json();
        
        if (reservations.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle"></i>
                    Aucune réservation trouvée pour cet email.
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Destination</th>
                            <th>Départ</th>
                            <th>Date</th>
                            <th>Heure</th>
                            <th>Siège</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reservations.map((r, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${r.destination}</strong></td>
                                <td>${r.depart}</td>
                                <td>${new Date(r.date).toLocaleDateString('fr-FR')}</td>
                                <td>${r.heure.substring(0, 5)}</td>
                                <td><span class="badge bg-primary">${r.numero_siege}</span></td>
                                <td>
                                    <span class="badge ${r.statut === 'confirmée' ? 'bg-success' : 'bg-danger'}">
                                        ${r.statut}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p class="text-muted mt-2">
                <i class="fas fa-info-circle"></i> Total : ${reservations.length} réservation(s)
            </p>
        `;
        
    } catch (error) {
        console.error('Erreur:', error);
        container.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-circle"></i>
                Erreur de chargement de l'historique.
            </div>
        `;
    }
}