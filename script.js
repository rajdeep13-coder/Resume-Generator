document.addEventListener('DOMContentLoaded', function() {

  // ===== Helper Functions =====
  function updatePreview() {
    // Basic Info
    document.getElementById('preview-name').textContent =
      document.getElementById('input-name').value || 'Your Name';

    document.getElementById('preview-email').textContent =
      document.getElementById('input-email').value || 'john@example.com';

    document.getElementById('preview-phone').textContent =
      document.getElementById('input-phone').value || '+91-9876543210';

    const linkedin = document.getElementById('input-linkedin').value;
    document.getElementById('preview-linkedin').innerHTML =
      linkedin ? `<a href="${linkedin}" target="_blank">${linkedin}</a>` : 'linkedin.com/in/john';

    const github = document.getElementById('input-github').value;
    document.getElementById('preview-github').innerHTML =
      github ? `<a href="${github}" target="_blank">${github}</a>` : 'github.com/john';

    document.getElementById('preview-about').textContent =
      document.getElementById('input-about').value || 'Passionate developer with 3 years of experience...';

    // Education
    const eduList = document.getElementById('preview-education');
    eduList.innerHTML = '';
    document.querySelectorAll('.education-inputs').forEach(eduDiv => {
      const institution = eduDiv.querySelector('.education-institution').value;
      const degree = eduDiv.querySelector('.education-degree').value;
      const gpa = eduDiv.querySelector('.education-gpa').value;
      const location = eduDiv.querySelector('.education-location').value;
      const dates = eduDiv.querySelector('.education-dates').value;
      if (institution || degree) {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${institution}</strong>${degree ? `, ${degree}` : ''}
          ${gpa ? ` | GPA: ${gpa}` : ''}<br>
          ${location ? location + ' | ' : ''}${dates}
        `;
        eduList.appendChild(li);
      }
    });

    // Skills
    document.getElementById('preview-languages').textContent =
      document.getElementById('input-languages').value;
    document.getElementById('preview-frameworks').textContent =
      document.getElementById('input-frameworks').value;
    document.getElementById('preview-tools').textContent =
      document.getElementById('input-tools').value;
    document.getElementById('preview-platforms').textContent =
      document.getElementById('input-platforms').value;
    document.getElementById('preview-soft-skills').textContent =
      document.getElementById('input-soft-skills').value;

    // Work Experience
    const expList = document.getElementById('preview-experience');
    expList.innerHTML = '';
    document.querySelectorAll('.experience-inputs').forEach(expDiv => {
      const role = expDiv.querySelector('.experience-role').value;
      const company = expDiv.querySelector('.experience-company').value;
      const link = expDiv.querySelector('.experience-link').value;
      const dates = expDiv.querySelector('.experience-dates').value;
      const desc = expDiv.querySelector('.experience-desc').value;
      if (role || company) {
        const li = document.createElement('li');
        const companyLink = link
          ? `<a href="${link}" target="_blank">${company}</a>`
          : company;
        li.innerHTML = `
          <strong>${role}</strong>${company ? `, ${companyLink}` : ''}${dates ? ` | ${dates}` : ''}
          <ul>${desc.split('\n').filter(d => d.trim()).map(d => `<li>${d}</li>`).join('')}</ul>
        `;
        expList.appendChild(li);
      }
    });

    // Certificates
    const certList = document.getElementById('preview-cert');
    certList.innerHTML = '';
    document.querySelectorAll('.certifications-inputs').forEach(certDiv => {
      const title = certDiv.querySelector('.certificate-title').value;
      const issuer = certDiv.querySelector('.certificate-issuer').value;
      const date = certDiv.querySelector('.certificate-date').value;
      const desc = certDiv.querySelector('.certificate-desc').value;
      if (title || issuer) {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${title}</strong>${issuer ? ` (${issuer})` : ''}${date ? ` | ${date}` : ''}
          <ul>${desc.split('\n').filter(d => d.trim()).map(d => `<li>${d}</li>`).join('')}</ul>
        `;
        certList.appendChild(li);
      }
    });

    // Projects
    const projList = document.getElementById('preview-projects');
    projList.innerHTML = '';
    document.querySelectorAll('.project-input').forEach(projDiv => {
      const title = projDiv.querySelector('.project-title').value;
      const link = projDiv.querySelector('.project-link').value;
      const desc = projDiv.querySelector('.project-desc').value;
      if (title || desc) {
        const li = document.createElement('li');
        const linkHTML = link
          ? `<div class="project-links"><a href="${link}" target="_blank">Live Demo</a></div>`
          : '';
        li.innerHTML = `
          <strong>${title}</strong>
          ${linkHTML}
          <ul>${desc.split('\n').filter(d => d.trim()).map(d => `<li>${d}</li>`).join('')}</ul>
        `;
        projList.appendChild(li);
      }
    });
  }

  // ===== Dynamic Add/Remove Blocks =====
  function setupAddRemove(sectionId, blockClass, blockHTML) {
    document.getElementById(sectionId).addEventListener('click', function(e) {
      if (e.target.classList.contains('add-btn')) {
        const container = this.querySelector('div');
        const div = document.createElement('div');
        div.className = blockClass;
        div.innerHTML = blockHTML;
        // Add remove button
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'remove-btn';
        btn.textContent = 'Remove';
        btn.onclick = function() {
          div.remove();
          updatePreview();
        };
        div.appendChild(btn);
        container.appendChild(div);
        // Add listeners for new inputs
        Array.from(div.querySelectorAll('input, textarea')).forEach(el => {
          el.addEventListener('input', updatePreview);
        });
      }
    });
  }

  // ===== Set Up All Dynamic Sections =====
  setupAddRemove(
    'education-inputs',
    'education-inputs',
    `
      <input type="text" placeholder="Institution" class="education-institution" />
      <input type="text" placeholder="Degree" class="education-degree" />
      <input type="text" placeholder="GPA" class="education-gpa" />
      <input type="text" placeholder="Location" class="education-location" />
      <input type="text" placeholder="Dates" class="education-dates" />
    `
  );
  setupAddRemove(
    'experience-inputs',
    'experience-inputs',
    `
      <input type="text" placeholder="Role" class="experience-role" />
      <input type="text" placeholder="Company" class="experience-company" />
      <input type="text" placeholder="Company Link" class="experience-link" />
      <input type="text" placeholder="Dates" class="experience-dates" />
      <textarea placeholder="Key achievements (1 per line)" class="experience-desc"></textarea>
    `
  );
  setupAddRemove(
    'certifications-inputs',
    'certifications-inputs',
    `
      <input type="text" placeholder="Certificate Name" class="certificate-title" />
      <input type="text" placeholder="Issuing Organization" class="certificate-issuer" />
      <input type="text" placeholder="Date" class="certificate-date" />
      <textarea placeholder="Description (1 per line)" class="certificate-desc"></textarea>
    `
  );
  setupAddRemove(
    'projects-inputs',
    'project-input',
    `
      <input type="text" placeholder="Project Title" class="project-title" />
      <input type="url" placeholder="Project Link (URL)" class="project-link" />
      <textarea placeholder="Key achievements (1 per line)" class="project-desc"></textarea>
    `
  );

  // ===== Listeners for Static Inputs =====
  Array.from(document.querySelectorAll('.form-section input, .form-section textarea')).forEach(el => {
    el.addEventListener('input', updatePreview);
  });

  // ===== PDF Download =====
  document.getElementById('downloadBtn').addEventListener('click', () => {
    document.querySelector('.form-section').style.display = 'none';
    html2pdf(document.getElementById('resumeContent'), {
      margin: [0.3, 0.5],
      filename: 'resume.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).then(() => {
      document.querySelector('.form-section').style.display = '';
    });
  });

  // ===== Initial Preview =====
  updatePreview();
});
