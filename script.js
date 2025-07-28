// Live Preview Bindings
function bindInputToPreview(inputId, previewId, isLink = false) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  input.addEventListener("input", () => {
    if (isLink && input.value) {
      preview.innerHTML = `<a href="${input.value}" target="_blank">${input.value}</a>`;
    } else {
      preview.textContent = input.value;
    }
  });
}

bindInputToPreview("input-name", "preview-name");
bindInputToPreview("input-email", "preview-email");
bindInputToPreview("input-phone", "preview-phone");
bindInputToPreview("input-linkedin", "preview-linkedin", true);
bindInputToPreview("input-github", "preview-github", true);
bindInputToPreview("input-about", "preview-about");
bindInputToPreview("input-languages", "preview-languages");
bindInputToPreview("input-frameworks", "preview-frameworks");
bindInputToPreview("input-tools", "preview-tools");
bindInputToPreview("input-platforms", "preview-platforms");
bindInputToPreview("input-soft-skills", "preview-soft-skills");

// Dynamic Section Helpers
function createRemoveBtn() {
  const btn = document.createElement("button");
  btn.className = "remove-btn";
  btn.textContent = "Remove";
  return btn;
}

function handleAddSection(buttonId, containerId, inputClass, previewContainerId, generateHTML) {
  const button = document.getElementById(buttonId);
  const container = document.getElementById(containerId);
  const previewContainer = document.getElementById(previewContainerId);

  button.addEventListener("click", () => {
    const original = container.querySelector(`.${inputClass}`);
    const clone = original.cloneNode(true);
    clone.querySelectorAll("input, textarea").forEach(input => input.value = "");
    const removeBtn = createRemoveBtn();

    removeBtn.addEventListener("click", () => {
      clone.remove();
      updatePreviewList(container, previewContainer, inputClass, generateHTML);
    });

    clone.appendChild(removeBtn);
    container.appendChild(clone);
  });

  container.addEventListener("input", () => {
    updatePreviewList(container, previewContainer, inputClass, generateHTML);
  });
}

function updatePreviewList(container, previewContainer, inputClass, generateHTML) {
  const entries = container.querySelectorAll(`.${inputClass}`);
  previewContainer.innerHTML = "";

  entries.forEach(entry => {
    const html = generateHTML(entry);
    if (html) previewContainer.innerHTML += html;
  });
}

// Education Section
handleAddSection(
  "add-education", "education-inputs", "education-inputs", "preview-education",
  (entry) => {
    const inst = entry.querySelector(".education-institution").value;
    const deg = entry.querySelector(".education-degree").value;
    const gpa = entry.querySelector(".education-gpa").value;
    const loc = entry.querySelector(".education-location").value;
    const dates = entry.querySelector(".education-dates").value;
    if (inst || deg || gpa || loc || dates) {
      return `<li><strong>${inst}</strong>, ${deg}<br>GPA: ${gpa} | ${loc} | ${dates}</li>`;
    }
    return "";
  }
);

// Experience Section
handleAddSection(
  "add-experience", "experience-inputs", "experience-inputs", "preview-experience",
  (entry) => {
    const role = entry.querySelector(".experience-role").value;
    const comp = entry.querySelector(".experience-company").value;
    const link = entry.querySelector(".experience-link").value;
    const dates = entry.querySelector(".experience-dates").value;
    const desc = entry.querySelector(".experience-desc").value.trim().split("\n").filter(l => l).map(l => `<li>${l}</li>`).join("");

    if (role || comp || dates || desc) {
      return `
        <li>
          <strong>${role}</strong>, <a href="${link}" target="_blank">${comp}</a> | ${dates}
          <ul>${desc}</ul>
        </li>
      `;
    }
    return "";
  }
);

// Certificates Section
handleAddSection(
  "add-certificate", "certifications-inputs", "certifications-inputs", "preview-cert",
  (entry) => {
    const title = entry.querySelector(".certificate-title").value;
    const issuer = entry.querySelector(".certificate-issuer").value;
    const date = entry.querySelector(".certificate-date").value;
    const desc = entry.querySelector(".certificate-desc").value.trim().split("\n").filter(l => l).map(l => `<li>${l}</li>`).join("");

    if (title || issuer || date || desc) {
      return `
        <li>
          <strong>${title}</strong> (${issuer}) | ${date}
          <ul>${desc}</ul>
        </li>
      `;
    }
    return "";
  }
);

// Projects Section
handleAddSection(
  "add-project", "projects-inputs", "project-input", "preview-projects",
  (entry) => {
    const title = entry.querySelector(".project-title").value;
    const link = entry.querySelector(".project-link").value;
    const desc = entry.querySelector(".project-desc").value.trim().split("\n").filter(l => l).map(l => `<li>${l}</li>`).join("");

    if (title || link || desc) {
      return `
        <li>
          <strong>${title}</strong>
          <div class="project-links"><a href="${link}" target="_blank">LINK</a></div>
          <ul>${desc}</ul>
        </li>
      `;
    }
    return "";
  }
);

// PDF Download
document.getElementById("downloadBtn").addEventListener("click", () => {
  const content = document.getElementById("resumeContent");
  const options = {
    margin:       0.5,
    filename:     'resume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(content).set(options).save();
});
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll(".fade-in").forEach(el => {
    observer.observe(el);
  });
});
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Run observer code
}
document.getElementById("downloadDocxBtn").addEventListener("click", () => {
  const resumeContent = document.getElementById("resumeContent").cloneNode(true);

  // Optional: remove animations if you want cleaner output
  resumeContent.querySelectorAll(".fade-in, .show").forEach(el => el.classList.remove("fade-in", "show"));

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export HTML to Word</title></head>
      <body>${resumeContent.innerHTML}</body>
    </html>`;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resume.doc';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

const toggle = document.getElementById('themeToggle');
const icon = toggle.querySelector('i');

// Check localStorage on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    icon.classList.remove('fa-sun'); // Ensure sun is not there
    icon.classList.add('fa-moon');   // Add moon for dark mode
  } else {
    document.body.classList.remove('dark'); // Ensure light mode
    icon.classList.remove('fa-moon'); // Ensure moon is not there
    icon.classList.add('fa-sun');    // Add sun for light mode
  }
});

toggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');

  if (isDark) {
    icon.classList.remove('fa-sun');  // Remove sun
    icon.classList.add('fa-moon');    // Add moon for dark mode
    icon.style.color = 'white';
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.remove('fa-moon'); // Remove moon
    icon.classList.add('fa-sun');     // Add sun for light mode
    icon.style.color = '#FFB300';
    localStorage.setItem('theme', 'light');
  }
});