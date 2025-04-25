// === Helper Functions ===
function updatePreview() {
  // Basic Info
  document.getElementById('preview-name').textContent = document.getElementById('input-name').value || 'John Doe';
  document.getElementById('preview-contact').textContent =
    `Email: ${document.getElementById('input-email').value || 'johndoe@example.com'} | Phone: ${document.getElementById('input-phone').value || '+91-1234567890'}`;

  // About
  document.getElementById('preview-about').textContent = document.getElementById('input-about').value;

  // Education (dynamic)
  const eduList = document.getElementById('preview-education');
  eduList.innerHTML = '';
  document.querySelectorAll('#education-inputs .education-inputs').forEach(eduDiv => {
  const title = eduDiv.querySelector('.education-title').value;
  const desc = eduDiv.querySelector('.education-desc').value;
  if (title || desc) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${title}</strong><br>${desc}`;
    eduList.appendChild(li);
  }
});

  // Experience (dynamic)
  const expList = document.getElementById('preview-experience');
  expList.innerHTML = '';
  document.querySelectorAll('#experience-inputs .experience-inputs').forEach(expDiv => {
    const title = expDiv.querySelector('.experience-title').value;
    const desc = expDiv.querySelector('.experience-desc').value;
    if (title || desc) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${title}</strong><br>${desc}`;
      expList.appendChild(li);
    }
  });

  // Achievements (newline-separated)
  const achList = document.getElementById('preview-achievements');
  achList.innerHTML = '';
  const achievements = document.getElementById('input-achievements').value.split('\n').filter(a => a.trim());
  achievements.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a;
    achList.appendChild(li);
  });

  // Skills
  document.getElementById('preview-skills').textContent = document.getElementById('input-skills').value;

  // Languages
  document.getElementById('preview-lang').textContent = document.getElementById('input-lang').value;

  // Certifications (dynamic)
  const certPreview = document.getElementById('preview-cert');
  certPreview.innerHTML = '';
  document.querySelectorAll('#certifications-inputs .certifications-inputs').forEach(certDiv => {
    const title = certDiv.querySelector('.certificate-title').value;
    if (title) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${title}</strong>`;
      certPreview.appendChild(p);
    }
  });

  // Projects (dynamic)
  const projList = document.getElementById('preview-projects');
  projList.innerHTML = '';
  document.querySelectorAll('#projects-inputs .project-input').forEach(projDiv => {
    const title = projDiv.querySelector('.project-title').value;
    const desc = projDiv.querySelector('.project-desc').value;
    if (title || desc) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${title}</strong><br>${desc}`;
      projList.appendChild(li);
    }
  });
}

// === Event Listeners for Live Preview ===
document.querySelectorAll(
  '#input-name, #input-email, #input-phone, #input-about, #input-achievements, #input-skills, #input-lang'
).forEach(input => {
  input.addEventListener('input', updatePreview);
});

// === Dynamic Add/Remove for Education ===
document.getElementById('add-education').addEventListener('click', () => {
  const container = document.getElementById('education-inputs');
  const div = document.createElement('div');
  div.className = 'education-inputs';
  div.innerHTML = `
    <input type="text" placeholder="Education Title" class="education-title" />
    <textarea placeholder="Education description" class="education-desc"></textarea>
    <button type="button" class="remove-edu">Remove</button>
  `;
  container.appendChild(div);

  div.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', updatePreview);
  });
  div.querySelector('.remove-edu').addEventListener('click', () => {
    div.remove();
    updatePreview();
  });
});

// Initial listeners for first education input
document.querySelectorAll('#education-inputs input, #education-inputs textarea').forEach(el => {
  el.addEventListener('input', updatePreview);
});

// === Dynamic Add/Remove for Experience ===
document.getElementById('add-experience').addEventListener('click', () => {
  const container = document.getElementById('experience-inputs');
  const div = document.createElement('div');
  div.className = 'experience-inputs';
  div.innerHTML = `
    <input type="text" placeholder="Experience Title" class="experience-title" />
    <textarea placeholder="Experience description" class="experience-desc"></textarea>
    <button type="button" class="remove-exp">Remove</button>
  `;
  container.appendChild(div);

  div.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', updatePreview);
  });
  div.querySelector('.remove-exp').addEventListener('click', () => {
    div.remove();
    updatePreview();
  });
});

// Initial listeners for first experience input
document.querySelectorAll('#experience-inputs input, #experience-inputs textarea').forEach(el => {
  el.addEventListener('input', updatePreview);
});

// === Dynamic Add/Remove for Certifications ===
document.getElementById('add-certificate').addEventListener('click', () => {
  const container = document.getElementById('certifications-inputs');
  const div = document.createElement('div');
  div.className = 'certifications-inputs';
  div.innerHTML = `
    <input type="text" placeholder="Name of Certificate" class="certificate-title" />
    <button type="button" class="remove-cert">Remove</button>
  `;
  container.appendChild(div);

  div.querySelector('input').addEventListener('input', updatePreview);
  div.querySelector('.remove-cert').addEventListener('click', () => {
    div.remove();
    updatePreview();
  });
});

// Initial listeners for first certification input
document.querySelectorAll('#certifications-inputs input').forEach(el => {
  el.addEventListener('input', updatePreview);
});

// === Dynamic Add/Remove for Projects ===
document.getElementById('add-project').addEventListener('click', () => {
  const container = document.getElementById('projects-inputs');
  const div = document.createElement('div');
  div.className = 'project-input';
  div.innerHTML = `
    <input type="text" placeholder="Project title" class="project-title" />
    <textarea placeholder="Project description" class="project-desc"></textarea>
    <button type="button" class="remove-proj">Remove</button>
  `;
  container.appendChild(div);

  div.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', updatePreview);
  });
  div.querySelector('.remove-proj').addEventListener('click', () => {
    div.remove();
    updatePreview();
  });
});

// Initial listeners for first project input
document.querySelectorAll('#projects-inputs input, #projects-inputs textarea').forEach(el => {
  el.addEventListener('input', updatePreview);
});

// === PDF Download ===
document.getElementById('downloadBtn').addEventListener('click', () => {
  // Hide form section and footer for PDF
  document.querySelector('.form-section').style.display = 'none';
  document.querySelector('.site-footer').style.display = 'none';
  html2pdf(document.getElementById('resumeContent'), {
    margin: 0.5,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).then(() => {
    document.querySelector('.form-section').style.display = '';
    document.querySelector('.site-footer').style.display = '';
    document.getElementById('downloadBtn').focus();
  });
});

// Initial preview
updatePreview();
