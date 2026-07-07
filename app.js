// -------------------------------
// Navigation entre les pages
// -------------------------------
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    pages.forEach(p => p.classList.add('hidden'));
    document.getElementById(target).classList.remove('hidden');

    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// -------------------------------
// Gestion de l'emploi du temps
// -------------------------------
let courses = JSON.parse(localStorage.getItem('courses')) || [];

const courseList = document.getElementById('course-list');
const addForm = document.getElementById('add-course-form');

// Affichage des cours
function renderCourses() {
  courseList.innerHTML = "";

  courses.forEach((course, index) => {
    const li = document.createElement('li');
    li.className = "course-item";

    li.innerHTML = `
      <span>${course.day} • ${course.time} • ${course.subject} • Semaine ${course.week}</span>
      <button class="delete-btn" data-index="${index}">Supprimer</button>
    `;

    courseList.appendChild(li);
  });

  updateNextClass();
}

// Ajout d'un cours
addForm.addEventListener('submit', e => {
  e.preventDefault();

  const day = document.getElementById('day').value;
  const time = document.getElementById('time').value;
  const week = document.getElementById('week').value;
  const subject = document.getElementById('subject').value;

  if (!time || !subject.trim()) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  courses.push({ day, time, week, subject });
  localStorage.setItem('courses', JSON.stringify(courses));

  addForm.reset();
  renderCourses();
});

// Suppression d'un cours
courseList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.dataset.index;
    courses.splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(courses));
    renderCourses();
  }
});

// -------------------------------
// Prochain cours (page d'accueil)
// -------------------------------
function updateNextClass() {
  const nextClassInfo = document.getElementById('next-class-info');

  if (courses.length === 0) {
    nextClassInfo.textContent = "Aucun cours enregistré";
    return;
  }

  // Tri par heure
  const sorted = [...courses].sort((a, b) => a.time.localeCompare(b.time));
  const next = sorted[0];

  nextClassInfo.textContent = `${next.subject} • ${next.day} à ${next.time}`;
}

// -------------------------------
// Initialisation
// -------------------------------
renderCourses();
console.log("SacSmart prêt avec emploi du temps !");
