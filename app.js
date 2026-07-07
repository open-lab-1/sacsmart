// ---------------------------------------------
// Navigation entre les pages
// ---------------------------------------------
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

// ---------------------------------------------
// Emploi du temps
// ---------------------------------------------
let courses = JSON.parse(localStorage.getItem('courses')) || [];

const courseList = document.getElementById('course-list');
const addForm = document.getElementById('add-course-form');

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
  refreshSubjectList();
}

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

courseList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.dataset.index;
    courses.splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(courses));
    renderCourses();
  }
});

// ---------------------------------------------
// Prochain cours (page d'accueil)
// ---------------------------------------------
function updateNextClass() {
  const nextClassInfo = document.getElementById('next-class-info');

  if (courses.length === 0) {
    nextClassInfo.textContent = "Aucun cours enregistré";
    return;
  }

  const sorted = [...courses].sort((a, b) => a.time.localeCompare(b.time));
  const next = sorted[0];

  nextClassInfo.textContent = `${next.subject} • ${next.day} à ${next.time}`;
}

// ---------------------------------------------
// Matériel par matière
// ---------------------------------------------
let materials = JSON.parse(localStorage.getItem('materials')) || {};

const subjectSelect = document.getElementById('material-subject-select');
const materialList = document.getElementById('material-list');
const addMaterialForm = document.getElementById('add-material-form');
const materialInput = document.getElementById('material-input');

function refreshSubjectList() {
  const uniqueSubjects = [...new Set(courses.map(c => c.subject))];

  subjectSelect.innerHTML = "";

  uniqueSubjects.forEach(sub => {
    const option = document.createElement('option');
    option.textContent = sub;
    subjectSelect.appendChild(option);

    if (!materials[sub]) materials[sub] = [];
  });

  localStorage.setItem('materials', JSON.stringify(materials));
  renderMaterials();
}

function renderMaterials() {
  const subject = subjectSelect.value;
  materialList.innerHTML = "";

  if (!subject || !materials[subject]) return;

  materials[subject].forEach((item, index) => {
    const li = document.createElement('li');
    li.className = "material-item";

    li.innerHTML = `
      <span>${item}</span>
      <div class="material-actions">
        <button class="edit-btn" data-index="${index}">✏️</button>
        <button class="delete-btn" data-index="${index}">❌</button>
      </div>
    `;

    materialList.appendChild(li);
  });

  updateSummary();
}

addMaterialForm.addEventListener('submit', e => {
  e.preventDefault();

  const subject = subjectSelect.value;
  const item = materialInput.value.trim();

  if (!item) {
    alert("Merci d’entrer un objet.");
    return;
  }

  materials[subject].push(item);
  localStorage.setItem('materials', JSON.stringify(materials));

  materialInput.value = "";
  renderMaterials();
});

materialList.addEventListener('click', e => {
  const subject = subjectSelect.value;

  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.dataset.index;
    materials[subject].splice(index, 1);
    localStorage.setItem('materials', JSON.stringify(materials));
    renderMaterials();
  }

  if (e.target.classList.contains('edit-btn')) {
    const index = e.target.dataset.index;
    const newValue = prompt("Modifier l’objet :", materials[subject][index]);

    if (newValue && newValue.trim()) {
      materials[subject][index] = newValue.trim();
      localStorage.setItem('materials', JSON.stringify(materials));
      renderMaterials();
    }
  }
});

// ---------------------------------------------
// Résumé du sac (page d'accueil)
// ---------------------------------------------
function updateSummary() {
  const summaryList = document.getElementById('summary-list');
  summaryList.innerHTML = "";

  const allItems = Object.values(materials).flat();

  if (allItems.length === 0) {
    summaryList.innerHTML = "<li>Aucun matériel disponible</li>";
    return;
  }

  allItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    summaryList.appendChild(li);
  });
}

// ---------------------------------------------
// Rappels récurrents
// ---------------------------------------------
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

const reminderList = document.getElementById('reminder-list');
const addReminderForm = document.getElementById('add-reminder-form');

function renderReminders() {
  reminderList.innerHTML = "";

  reminders.forEach((reminder, index) => {
    const li = document.createElement('li');
    li.className = "reminder-item";

    const freqLabel =
      reminder.frequency === "jour" ? "Chaque jour" :
      reminder.frequency === "semaine" ? "Chaque semaine" :
      "Chaque mois";

    li.innerHTML = `
      <span>${reminder.name} • ${freqLabel}${reminder.day ? " • " + reminder.day : ""}</span>
      <div class="reminder-actions">
        <button class="edit-btn" data-index="${index}">✏️</button>
        <button class="delete-btn" data-index="${index}">❌</button>
      </div>
    `;

    reminderList.appendChild(li);
  });
}

addReminderForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('reminder-name').value.trim();
  const frequency = document.getElementById('reminder-frequency').value;
  const day = document.getElementById('reminder-day').value;

  if (!name) {
    alert("Merci d’entrer un objet.");
    return;
  }

  if (frequency === "semaine" && !day) {
    alert("Merci de choisir un jour pour la fréquence hebdomadaire.");
    return;
  }

  reminders.push({ name, frequency, day });
  localStorage.setItem('reminders', JSON.stringify(reminders));

  addReminderForm.reset();
  renderReminders();
});

reminderList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.dataset.index;
    reminders.splice(index, 1);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();
  }

  if (e.target.classList.contains('edit-btn')) {
    const index = e.target.dataset.index;
    const current = reminders[index];
    const newName = prompt("Modifier l’objet :", current.name);

    if (newName && newName.trim()) {
      current.name = newName.trim();
      localStorage.setItem('reminders', JSON.stringify(reminders));
      renderReminders();
    }
  }
});

// ---------------------------------------------
// Bouton "Préparer mon sac"
// ---------------------------------------------
const prepareBtn = document.getElementById('prepare-btn');
const streakCount = document.getElementById('streak-count');
let streak = 3;

prepareBtn.addEventListener('click', () => {
  alert('Ton sac est prêt ✅');
  prepareBtn.style.transform = 'scale(0.95)';
  setTimeout(() => prepareBtn.style.transform = 'scale(1)', 150);
  streak++;
  streakCount.textContent = `${streak} jours`;
});

// ---------------------------------------------
// PWA : enregistrement du Service Worker
// ---------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker enregistré', reg.scope))
      .catch(err => console.error('Erreur SW', err));
  });
}

// ---------------------------------------------
// Initialisation
// ---------------------------------------------
renderCourses();
refreshSubjectList();
updateSummary();
renderReminders();
console.log("SacSmart PWA prêt !");
