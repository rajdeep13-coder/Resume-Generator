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

// handles live character counting
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


// --- GLOBAL FUNCTIONS FOR VALIDATION ---
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(span => {
        span.textContent = '';
    });
}

function validateForm() {
    clearErrors(); // Clear any existing errors first

    let isValid = true; // Assume valid until an error is found

    // Validate Full Name: Minimum 3 characters
    const nameInput = document.getElementById('input-name');
    if (nameInput.value.trim().length < 3) {
        document.getElementById('error-name').textContent = 'Full Name must be at least 3 characters.';
        isValid = false;
    }

    // Validate Email: Basic email format (e.g., user@example.com)
    const emailInput = document.getElementById('input-email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        document.getElementById('error-email').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate Phone Number: At least 10 digits (allowing optional + and spaces/hyphens)
    const phoneInput = document.getElementById('input-phone');
    const phonePattern = /^\+?[0-9\s-]{10,}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
        document.getElementById('error-phone').textContent = 'Please enter a valid phone number (at least 10 digits).';
        isValid = false;
    }

    // Validate LinkedIn Link (optional field, so only validate if value exists)
    const linkedinInput = document.getElementById('input-linkedin');
    const linkedinPattern = /^(https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?)$/i;
    if (linkedinInput.value.trim() && !linkedinPattern.test(linkedinInput.value.trim())) {
        document.getElementById('error-linkedin').textContent = 'Please enter a valid LinkedIn profile URL.';
        isValid = false;
    }

    // Validate GitHub Link (optional field, so only validate if value exists)
    const githubInput = document.getElementById('input-github');
    const githubPattern = /^(https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?)$/i;
    if (githubInput.value.trim() && !githubPattern.test(githubInput.value.trim())) {
        document.getElementById('error-github').textContent = 'Please enter a valid GitHub profile URL.';
        isValid = false;
    }

    // Validate Professional Summary: Minimum 50 characters
    const aboutInput = document.getElementById('input-about');
    if (aboutInput.value.trim().length < 50) {
        document.getElementById('error-about').textContent = 'Professional Summary should be at least 50 characters.';
        isValid = false;
    }

    return isValid;
}


// --- PDF Download Button ---
document.getElementById("downloadBtn").addEventListener("click", () => {
    // Call validateForm() at the very beginning of the click handler
    if (!validateForm()) { // If validation returns false (meaning there are errors)
        alert("Please correct the highlighted errors in the form before downloading your resume.");
        return; // STOP the function execution here. This prevents the PDF download.
    }

    // If validation passes (validateForm() returned true), then proceed with download
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

// --- DOCX Download Button ---
document.getElementById("downloadDocxBtn").addEventListener("click", () => {
    // Call validateForm() at the very beginning of the click handler
    if (!validateForm()) { // If validation returns false (meaning there are errors)
        alert("Please correct the highlighted errors in the form before downloading your resume.");
        return; // STOP the function execution here. This prevents the DOCX download.
    }

    // If validation passes (validateForm() returned true), then proceed with download
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

// --- DOMContentLoaded Listener for fade-in animations ---
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
    // Run observer code if motion is not reduced
}

// --- Theme Toggle functionality ---
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
        icon.classList.remove('fa-sun');   // Remove sun
        icon.classList.add('fa-moon');     // Add moon for dark mode
        icon.style.color = 'white';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-moon');  // Remove moon
        icon.classList.add('fa-sun');      // Add sun for light mode
        icon.style.color = '#FFB300';
        localStorage.setItem('theme', 'light');
    }
});
// --- Draggable Resume Section Reordering ---
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("resume-sections");
    let draggedItem = null;

    container.addEventListener("dragstart", function (e) {
        if (e.target.classList.contains("section")) {
            draggedItem = e.target;
            e.target.classList.add("dragging");
        }
    });

    container.addEventListener("dragend", function (e) {
    if (draggedItem) {
        draggedItem.classList.remove("dragging");
        saveCurrentOrder(); // Save new order
        draggedItem = null;
    }
    });

    container.addEventListener("dragover", function (e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (draggedItem && afterElement == null) {
            container.appendChild(draggedItem);
        } else if (draggedItem && afterElement) {
            container.insertBefore(draggedItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".section:not(.dragging)")];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});

/*  // Undo Button
  document.getElementById("undoBtn").addEventListener("click", () => {
    if (undoStack.length > 1) {
      const current = undoStack.pop();
      redoStack.push(current);
      restoreOrder(undoStack[undoStack.length - 1]);
    }
  });

  // Redo Button
  document.getElementById("redoBtn").addEventListener("click", () => {
    if (redoStack.length > 0) {
      const next = redoStack.pop();
      undoStack.push(next);
      restoreOrder(next);
    }
  }); */
  