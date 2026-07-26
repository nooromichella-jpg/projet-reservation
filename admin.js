// public/js/admin.js
// Gère la connexion admin

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adminLoginForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        
        if (!email || !password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    mot_de_passe: password
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Connexion réussie
                localStorage.setItem('adminEmail', email);
                localStorage.setItem('adminId', result.admin.id);
                window.location.href = '/admin/dashboard.html';
            } else {
                alert(` Erreur : ${result.error}`);
            }
            
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion. Vérifiez que le serveur est lancé.');
        }
    });
});