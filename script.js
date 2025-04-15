function getDefaultText(field) {
  const defaults = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91-1234567890",
    about: "A passionate and dedicated professional seeking to leverage skills and experience to contribute effectively.",
    education: "B.Tech in Computer Science, XYZ University, 2024",
    achievements: ["Write about your academic/other achievements"],
    skills: "C, Java, Python, Flutter, AI/ML",
    projects: [
      { title: "Sample Project", desc: "A brief description of the project and your role in it." }
    ]
  };
  return defaults[field];
}

// === Real-time Preview Update ===

function updatePreview() {
  // Name
  const name = document.getElementById('input-name').value.trim() || getDefaultText('name');
  document.getElementById('preview-name').textContent = name;

  // Email & Phone
  const email = document.getElementById('input-email').value.trim() || getDefaultText('email');
  const phone = document.getElementById('input-phone').value.trim() || getDefaultText('phone');
  document.getElementById('preview-contact').textContent = `Email: ${email} | Phone: ${phone}`;

  // About
  const about = document.getElementById('input-about').value.trim() || getDefaultText('about');
  document.getElementById('preview-about').textContent = about;

  // Education
  const education = document.getElementById('input-education').value.trim() || getDefaultText('education');
  document.getElementById('preview-education').textContent = education;

  // Achievements (as bullet points)
  const achievementsInput = document.getElementById('input-achievements').value.trim();
  const achievementsList = document.getElementById('preview-achievements');
  achievementsList.innerHTML = '';
  let achievementsArr = [];
  if (achievementsInput) {
    achievementsArr = achievementsInput.split(/\n|•/).map(s => s.trim()).filter(Boolean);
  } else {
    achievementsArr = getDefaultText('achievements');
  }
  achievementsArr.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.replace(/^•\s*/, '');
    achievementsList.appendChild(li);
  });

  // Skills
  const skills = document.getElementById('input-skills').value.trim() || getDefaultText('skills');
  document.getElementById('preview-skills').textContent = skills;

  // Projects 
  const projectsList = document.getElementById('preview-projects');
  projectsList.innerHTML = '';
  const projectInputs = document.querySelectorAll('#projects-inputs .project-input');
  let hasProject = false;
  projectInputs.forEach((proj, idx) => {
    const title = proj.querySelector('.project-title').value.trim();
    const desc = proj.querySelector('.project-desc').value.trim();
    if (title || desc) {
      hasProject = true;
      const li = document.createElement('li');
      li.innerHTML = `<strong>${title || "Untitled Project"}</strong>: ${desc || "No description provided."}`;
      projectsList.appendChild(li);
    }
  });
  if (!hasProject) {
    // Show default project
    const def = getDefaultText('projects')[0];
    const li = document.createElement('li');
    li.innerHTML = `<strong>${def.title}</strong>: ${def.desc}`;
    projectsList.appendChild(li);
  }
}

// === Dynamic Project Fields ===

document.getElementById('add-project').addEventListener('click', function(e) {
  e.preventDefault();
  const container = document.getElementById('projects-inputs');
  const div = document.createElement('div');
  div.className = 'project-input';
  div.innerHTML = `
    <input type="text" placeholder="Project title" class="project-title" />
    <textarea placeholder="Project description" class="project-desc"></textarea>
  `;
  container.appendChild(div);
  // Add event listeners to new fields
  div.querySelector('.project-title').addEventListener('input', updatePreview);
  div.querySelector('.project-desc').addEventListener('input', updatePreview);
});

// === Attach Input Listeners ===

[
  'input-name', 'input-email', 'input-phone',
  'input-about', 'input-education', 'input-achievements', 'input-skills'
].forEach(id => {
  document.getElementById(id).addEventListener('input', updatePreview);
});

// Initial project input listeners
function attachProjectInputListeners() {
  document.querySelectorAll('.project-title, .project-desc').forEach(el => {
    el.addEventListener('input', updatePreview);
  });
}
attachProjectInputListeners();

// Also attach listeners to dynamically added project fields
const observer = new MutationObserver(attachProjectInputListeners);
observer.observe(document.getElementById('projects-inputs'), { childList: true });

// === PDF Download ===

document.getElementById('downloadBtn').addEventListener('click', function(e) {
  e.preventDefault();
  updatePreview(); 
  setTimeout(() => {
    const element = document.getElementById('resumeContent');
    const opt = {
      margin:       0.5,
      filename:     'resume.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }, 150); 
});

// === Initial Preview Fill ===
updatePreview();
