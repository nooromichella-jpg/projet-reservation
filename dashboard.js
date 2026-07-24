// public/js/dashboard.js
// Dashboard admin - statistiques et liste des réservations

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'admin est connecté
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
        alert('Veuillez vous connecter d\'abord.');
        window.location.href = '/admin/index.html';
        return;
    }
    
    chargerStats();
    chargerReservations();
});

async function chargerStats() {
    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        document.getElementById('totalVoyages').textContent = stats.totalVoyages;
        document.getElementById('totalReservations').textContent = stats.totalReservations;
        document.getElementById('reservationsToday').textContent = stats.reservationsToday;
        
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function chargerReservations() {
    const container = document.getElementById('reservationsList');
    
    try {
        const response = await fetch('/api/admin/reservations');
        const reservations = await response.json();
        
        if (reservations.length === 0) {
            container.innerHTML = `
                <p class="text-center text-muted my-5">
                    <i class="fas fa-inbox fa-3x d-block mb-3"></i>
                    Aucune réservation pour le moment.
                </p>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Email</th>
                            <th>Destination</th>
                            <th>Départ</th>
                            <th>Date</th>
                            <th>Siège</th>
                            <th>Statut</th>
                            <th>Réservé le</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reservations.map(r => `
                            <tr>
                                <td>#${r.id}</td>
                                <td><strong>${r.nom_client}</strong></td>
                                <td>${r.email_client}</td>
                                <td>${r.destination}</td>
                                <td>${r.depart}</td>
                                <td>${new Date(r.date).toLocaleDateString('fr-FR')}</td>
                                <td><span class="badge bg-primary">${r.numero_siege}</span></td>
                                <td>
                                    <span class="badge ${r.statut === 'confirmée' ? 'bg-success' : 'bg-danger'}">
                                        ${r.statut}
                                    </span>
                                </td>
                                <td>${new Date(r.date_reservation).toLocaleString('fr-FR')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p class="text-muted mt-2">
                    <i class="fas fa-info-circle"></i> Total : ${reservations.length} réservation(s)
                </p>
            </div>
        `;
        
    } catch (error) {
        console.error('Erreur:', error);
        container.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-circle"></i>
                Erreur de chargement des réservations.
            </div>
        `;
    }
}