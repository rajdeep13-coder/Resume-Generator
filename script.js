// Live Preview Bindings
function bindInputToPreview(inputId, previewId, isLink = false) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  // Function to update the preview content based on input
  const updatePreview = () => {
    let inputValue = input.value.trim(); // Get trimmed input value

    // Determine the text to display in the preview
    let displayContent = '';
    let linkHref = '';
    let isActualLink = false;

    if (inputId === "input-email") {
      // If input has value, use "Email: value", else use the span's initial text
      displayContent = inputValue ? `Email: ${inputValue}` : preview.dataset.initialContent || 'Email: john@example.com';
    } else if (inputId === "input-phone") {
      // If input has value, use "Ph no: value", else use the span's initial text
      displayContent = inputValue ? `Ph no: ${inputValue}` : preview.dataset.initialContent || 'Ph no: +91-9876543210';
    } else if (isLink) {
      // For link inputs (LinkedIn, GitHub)
      if (inputValue) {
        isActualLink = true;
        linkHref = inputValue;
        if (inputId === "input-linkedin") {
          displayContent = "LinkedIn"; // Display "LinkedIn" for LinkedIn links
        } else if (inputId === "input-github") {
          displayContent = "GitHub"; // Display "GitHub" for GitHub links
        } else {
          displayContent = "Click here"; // Generic link text for other links
        }
      } else {
        // If link input is empty, revert to the span's initial content (e.g., "linkedin.com/in/john")
        displayContent = preview.dataset.initialContent || '';
      }
    } else {
      // For other fields (name, about, skills), use input value or the span's initial text
      displayContent = inputValue || preview.dataset.initialContent || '';
    }

    // Apply the content to the preview element
    if (isActualLink) {
      preview.innerHTML = `<a href="${linkHref}" target="_blank">${displayContent}</a>`;
    } else {
      preview.textContent = displayContent;
    }
  };

  // Store the initial content of the preview span so we can revert to it if the input is empty
  // This is crucial for keeping the placeholder text in the resume preview.
  preview.dataset.initialContent = preview.textContent;

  // Attach the 'input' event listener for real-time updates as the user types
  input.addEventListener("input", updatePreview);

  // Call updatePreview once immediately when the page loads
  // This ensures initial values (or placeholders) are displayed correctly.
  updatePreview();
}

// Bind all input fields to their respective preview elements
bindInputToPreview("input-name", "preview-name");
bindInputToPreview("input-email", "preview-email");
bindInputToPreview("input-phone", "preview-phone");
bindInputToPreview("input-linkedin", "preview-linkedin", true); // LinkedIn is a link
bindInputToPreview("input-github", "preview-github", true);     // GitHub is a link
bindInputToPreview("input-about", "preview-about");
bindInputToPreview("input-languages", "preview-languages");
bindInputToPreview("input-frameworks", "preview-frameworks");
bindInputToPreview("input-tools", "preview-tools");
bindInputToPreview("input-platforms", "preview-platforms");
bindInputToPreview("input-soft-skills", "preview-soft-skills");

// handles live character counting for "About Me" section
function setupCharacterCounter(inputId) {
  const inputElement = document.getElementById(inputId);
  const charCountElement = document.getElementById(`charCount-${inputId}`);
  if (inputElement && charCountElement) {
    const maxLength = inputElement.getAttribute('maxlength');
    const updateCount = () => {
      const currentLength = inputElement.value.length;
      charCountElement.textContent = `${currentLength}/${maxLength} characters`;
      if (currentLength > maxLength) {
        charCountElement.classList.add('exceeded');
      } else {
        charCountElement.classList.remove('exceeded');
      }
    };
    updateCount();
    inputElement.addEventListener('input', updateCount);
  }
}
setupCharacterCounter("input-about");

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
    clone.querySelectorAll("input, textarea").forEach(input => input.value = ""); // Clear values in cloned inputs
    const removeBtn = createRemoveBtn();

    removeBtn.addEventListener("click", () => {
      clone.remove();
      updatePreviewList(container, previewContainer, inputClass, generateHTML); // Update preview after removing
    });

    clone.appendChild(removeBtn);
    container.appendChild(clone);
    updatePreviewList(container, previewContainer, inputClass, generateHTML); // Update preview after adding
  });

  // Listen for input events on the container to update the preview list
  container.addEventListener("input", () => {
    updatePreviewList(container, previewContainer, inputClass, generateHTML);
  });

  // Initial update for dynamically added sections (e.g., if there's pre-filled data)
  updatePreviewList(container, previewContainer, inputClass, generateHTML);
}

function updatePreviewList(container, previewContainer, inputClass, generateHTML) {
  const entries = container.querySelectorAll(`.${inputClass}`);
  previewContainer.innerHTML = ""; // Clear existing preview content

  entries.forEach(entry => {
    const html = generateHTML(entry);
    if (html) previewContainer.innerHTML += html; // Add generated HTML if not empty
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
      // Conditionally render the company name as a link or plain text
      const companyDisplay = link ? `<a href="${link}" target="_blank">${comp}</a>` : comp;

      return `
        <li>
          <strong>${role}</strong>, ${companyDisplay} | ${dates}
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
      // Conditionally render the link text
      const projectLinkDisplay = link ? `<div class="project-links"><a href="${link}" target="_blank">View Project</a></div>` : '';

      return `
        <li>
          <strong>${title}</strong>
          ${projectLinkDisplay}
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
    margin: 0.5,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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
  // Run observer code - this comment is fine, no specific code here needed
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
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  } else {
    document.body.classList.remove('dark');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
});

toggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');

  if (isDark) {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    icon.style.color = 'white';
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    icon.style.color = '#FFB300';
    localStorage.setItem('theme', 'light');
  }
});

// Autofill function
function autofillResume() {
  // Basic Info
  document.getElementById("input-name").value = "John Doe";
  document.getElementById("input-email").value = "john.doe@example.com";
  document.getElementById("input-phone").value = "+1-555-123-4567";
  document.getElementById("input-linkedin").value = "https://linkedin.com/in/johndoe";
  document.getElementById("input-github").value = "https://github.com/johndoe";
  document.getElementById("input-about").value = "Highly motivated and results-oriented software engineer with 5 years of experience in developing scalable web applications. Proficient in full-stack development, with a strong focus on clean code and efficient algorithms. Seeking to leverage strong technical skills and problem-solving abilities to contribute to innovative projects.";

  // Education (Autofill the first one, you'd need more logic for multiple)
  document.querySelector(".education-institution").value = "University of Tech";
  document.querySelector(".education-degree").value = "M.S. in Computer Science";
  document.querySelector(".education-gpa").value = "3.9/4.0";
  document.querySelector(".education-location").value = "San Francisco, CA";
  document.querySelector(".education-dates").value = "2020-2022";

  // Skills Summary
  document.getElementById("input-languages").value = "JavaScript, Python, Java, C++";
  document.getElementById("input-frameworks").value = "React, Node.js, Django, Spring Boot";
  document.getElementById("input-tools").value = "Git, Docker, Kubernetes, AWS, VS Code";
  document.getElementById("input-platforms").value = "AWS, GCP, Azure, Heroku";
  document.getElementById("input-soft-skills").value = "Problem Solving, Teamwork, Communication, Leadership, Adaptability";

  // Work Experience (Autofill the first one)
  document.querySelector(".experience-role").value = "Senior Software Engineer";
  document.querySelector(".experience-company").value = "Tech Solutions Inc.";
  document.querySelector(".experience-link").value = "https://techsolutions.com";
  document.querySelector(".experience-dates").value = "Jan 2023 - Present";
  document.querySelector(".experience-desc").value = "Designed and implemented robust microservices using Node.js and AWS Lambda.\nOptimized database queries, reducing response times by 30%.\nMentored junior developers and led code reviews to ensure high-quality code.";

  // Certificates (Autofill the first one)
  document.querySelector(".certificate-title").value = "AWS Certified Solutions Architect – Associate";
  document.querySelector(".certificate-issuer").value = "Amazon Web Services";
  document.querySelector(".certificate-date").value = "March 2024";
  document.querySelector(".certificate-desc").value = "Validated expertise in designing distributed systems on AWS.\nProficient in core AWS services like EC2, S3, RDS, VPC.";

  // Projects (Autofill the first one)
  document.querySelector(".project-title").value = "E-commerce Platform Redesign";
  document.querySelector(".project-link").value = "https://github.com/johndoe/ecommerce-redesign";
  document.querySelector(".project-desc").value = "Led the front-end redesign of a major e-commerce platform using React and Redux.\nImproved user engagement by 25% and conversion rates by 15% through A/B testing.\nIntegrated RESTful APIs for seamless data flow.";

  // Trigger input events to update the preview after autofilling
  // This is crucial to make the bindInputToPreview function process the new values.
  document.querySelectorAll('input, textarea').forEach(element => {
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Manually trigger updates for dynamic sections if they exist (important for autofill to show up)
  // This ensures lists like education, experience, etc., are also updated.
  document.getElementById("education-inputs").dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById("experience-inputs").dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById("certifications-inputs").dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById("projects-inputs").dispatchEvent(new Event('input', { bubbles: true }));
}