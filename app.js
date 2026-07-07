// Initialisation de la page
document.addEventListener('DOMContentLoaded', () => {
  const prepareBtn = document.getElementById('prepare-btn');
  const streakCount = document.getElementById('streak-count');

  // Exemple d'interaction simple
  prepareBtn.addEventListener('click', () => {
    alert('Ton sac est prêt ✅');
    // Animation légère
    prepareBtn.style.transform = 'scale(0.95)';
    setTimeout(() => prepareBtn.style.transform = 'scale(1)', 150);
  });

  // Exemple de mise à jour du compteur
  let streak = 3;
  setInterval(() => {
    streak++;
    streakCount.textContent = `${streak} jours`;
  }, 10000); // simulation toutes les 10s
});
