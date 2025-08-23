// --- STATE MANAGEMENT (for Undo/Redo) ---
let undoStack = [];
let redoStack = [];

document.addEventListener("DOMContentLoaded", () => {
    // Bindings for all form fields
    bindInputToPreview("input-name", "preview-name");
    bindInputToPreview("input-email", "preview-email");
    
    
    setupCharacterCounter("input-about");
    initializeDynamicSections();
    setupValidationListeners();
    initializeFeatures();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("show");
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
});
// --- LIVE PREVIEW BINDINGS & HELPERS ---
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

function bindTitle(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    input.addEventListener('input', () => {
        preview.textContent = input.value;
    });
}

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

// --- INITIALIZE BINDINGS ON LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    // Basic Info
    bindInputToPreview("input-name", "preview-name");
    bindInputToPreview("input-email", "preview-email");
    bindInputToPreview("input-phone", "preview-phone");
    bindInputToPreview("input-linkedin", "preview-linkedin", true);
    bindInputToPreview("input-github", "preview-github", true);
    bindInputToPreview("input-about", "preview-about");
    // Skills
    bindInputToPreview("input-languages", "preview-languages");
    bindInputToPreview("input-frameworks", "preview-frameworks");
    bindInputToPreview("input-tools", "preview-tools");
    bindInputToPreview("input-platforms", "preview-platforms");
    bindInputToPreview("input-soft-skills", "preview-soft-skills");
    // Custom Section Titles
    bindTitle("title-about", "preview-title-about");
    bindTitle("title-education", "preview-title-education");
    bindTitle("title-skills", "preview-title-skills");
    bindTitle("title-experience", "preview-title-experience");
    bindTitle("title-certificates", "preview-title-certificates");
    bindTitle("title-projects", "preview-title-projects");
    
    setupCharacterCounter("input-about");
    initializeDynamicSections();
    setupValidationListeners();
    initializeFeatures();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll(".fade-in").forEach(el => {
        observer.observe(el);
    });
});

// --- DYNAMIC SECTION MANAGEMENT ---
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

function initializeDynamicSections() {
    // Education Section
    handleAddSection("add-education", "education-inputs", "education-inputs", "preview-education", (entry) => {
        const inst = entry.querySelector(".education-institution").value;
        const deg = entry.querySelector(".education-degree").value;
        const gpa = entry.querySelector(".education-gpa").value;
        const loc = entry.querySelector(".education-location").value;
        const dates = entry.querySelector(".education-dates").value;
        if (inst || deg || gpa || loc || dates) {
            return `<li><strong>${inst}</strong>, ${deg}<br>GPA: ${gpa} | ${loc} | ${dates}</li>`;
        }
        return "";
    });

    // Experience Section
    handleAddSection("add-experience", "experience-inputs", "experience-inputs", "preview-experience", (entry) => {
        const role = entry.querySelector(".experience-role").value;
        const comp = entry.querySelector(".experience-company").value;
        const link = entry.querySelector(".experience-link").value;
        const dates = entry.querySelector(".experience-dates").value;
        const desc = entry.querySelector(".experience-desc").value.trim().split("\n").filter(l => l).map(l => `<li>${l}</li>`).join("");
        if (role || comp || dates || desc) {
            return `<li><strong>${role}</strong>, <a href="${link}" target="_blank">${comp}</a> | ${dates}<ul>${desc}</ul></li>`;
        }
        return "";
    });

    // Certificates Section
    handleAddSection("add-certificate", "certifications-inputs", "certifications-inputs", "preview-cert", (entry) => {
        const title = entry.querySelector(".certificate-title").value;
        const issuer = entry.querySelector(".certificate-issuer").value;
        const date = entry.querySelector(".certificate-date").value;
        const desc = entry.querySelector(".certificate-desc").value.trim().split("\n").filter(l => l).map(l => `<li>${l}</li>`).join("");
        if (title || issuer || date || desc) {
            return `<li><strong>${title}</strong> (${issuer}) | ${date}<ul>${desc}</ul></li>`;
        }
        return "";
    });

    // Projects Section
    handleAddSection("add-project", "projects-inputs", "project-input", "preview-projects", (entry) => {
        const title = entry.querySelector(".project-title").value;
        const link = entry.querySelector(".project-link").value;
        const desc = entry.querySelector(".project-desc").value.trim().split("\n").filter(l => l).map(l => `<li>${l}</li>`).join("");
        if (title || link || desc) {
            return `<li><strong>${title}</strong><div class="project-links"><a href="${link}" target="_blank">LINK</a></div><ul>${desc}</ul></li>`;
        }
        return "";
    });
}

// --- FORM VALIDATION ---
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(span => span.textContent = '');
}

function validateField(input, errorEl, validationFn, message) {
    if (!validationFn(input.value.trim())) {
        errorEl.textContent = message;
        return false;
    }
    errorEl.textContent = '';
    return true;
}

function validateForm() {
    clearErrors();
    let isValid = true;
    
    isValid &= validateField(document.getElementById('input-name'), document.getElementById('error-name'), val => val.length >= 3, 'Full Name must be at least 3 characters.');
    isValid &= validateField(document.getElementById('input-email'), document.getElementById('error-email'), val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address.');
    isValid &= validateField(document.getElementById('input-phone'), document.getElementById('error-phone'), val => /^\+?[0-9\s-]{10,}$/.test(val), 'Please enter a valid phone number.');
    isValid &= validateField(document.getElementById('input-linkedin'), document.getElementById('error-linkedin'), val => !val || /^(https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?)$/i.test(val), 'Please enter a valid LinkedIn URL.');
    isValid &= validateField(document.getElementById('input-github'), document.getElementById('error-github'), val => !val || /^(https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?)$/i.test(val), 'Please enter a valid GitHub URL.');
    isValid &= validateField(document.getElementById('input-about'), document.getElementById('error-about'), val => val.length >= 50, 'Professional Summary should be at least 50 characters.');

    if (!isValid) {
      alert("Please correct the highlighted errors in the form before downloading your resume.");
    }
    return !!isValid;
}

function setupValidationListeners() {
    document.getElementById('input-name').addEventListener('blur', (e) => validateField(e.target, document.getElementById('error-name'), val => val.length >= 3, 'Full Name must be at least 3 characters.'));
    document.getElementById('input-email').addEventListener('blur', (e) => validateField(e.target, document.getElementById('error-email'), val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Please enter a valid email address.'));
    document.getElementById('input-phone').addEventListener('blur', (e) => validateField(e.target, document.getElementById('error-phone'), val => /^\+?[0-9\s-]{10,}$/.test(val), 'Please enter a valid phone number.'));
    document.getElementById('input-linkedin').addEventListener('blur', (e) => validateField(e.target, document.getElementById('error-linkedin'), val => !val || /^(https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?)$/i.test(val), 'Please enter a valid LinkedIn URL.'));
    document.getElementById('input-github').addEventListener('blur', (e) => validateField(e.target, document.getElementById('error-github'), val => !val || /^(https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?)$/i.test(val), 'Please enter a valid GitHub URL.'));
    document.getElementById('input-about').addEventListener('blur', (e) => validateField(e.target, document.getElementById('error-about'), val => val.length >= 50, 'Professional Summary should be at least 50 characters.'));
}

// --- FEATURE INITIALIZATION ---
function initializeFeatures() {
    // PDF Download
    document.getElementById("downloadBtn").addEventListener("click", () => {
        if (!validateForm()) return;

        // Hide non-printable elements before generating PDF
        const nonPrintable = document.querySelectorAll('.no-print');
        nonPrintable.forEach(el => el.style.display = 'none');

        const content = document.querySelector('#resumeContent');
        const options = { 
            margin: 0.5, 
            filename: 'resume.pdf', 
            image: { type: 'jpeg', quality: 0.98 }, 
            html2canvas: { scale: 2 }, 
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] } // Better page break handling
        };

        html2pdf().from(content).set(options).save().then(() => {
            // Restore non-printable elements after PDF is saved
            nonPrintable.forEach(el => el.style.display = ''); 
        });
    });

    // DOCX Download
    document.getElementById("downloadDocxBtn").addEventListener("click", () => {
        if (!validateForm()) return;
        // Clone the content to avoid modifying the live preview
        const resumeContent = document.querySelector('#resume-sections').cloneNode(true);
        // Remove non-printable elements from the clone
        resumeContent.querySelectorAll('.no-print').forEach(el => el.remove());
        
        const content = resumeContent.innerHTML;
        const html = `<html><head><meta charset='utf-8'></head><body>${content}</body></html>`;
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        saveAs(blob, 'resume.docx');
    });
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        icon.classList.toggle('fa-sun', !isDark);
        icon.classList.toggle('fa-moon', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.pageYOffset > 300);
    });
    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Draggable Sections & Undo/Redo
    const container = document.getElementById("resume-sections");
    let draggedItem = null;
    container.addEventListener("dragstart", e => {
        if (e.target.classList.contains("section")) {
            draggedItem = e.target;
            setTimeout(() => e.target.classList.add("dragging"), 0);
        }
    });
    container.addEventListener("dragend", e => {
        if(draggedItem) {
            draggedItem.classList.remove("dragging");
            saveOrder();
            draggedItem = null;
        }
    });
    container.addEventListener("dragover", e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (draggedItem) {
            if (afterElement == null) container.appendChild(draggedItem);
            else container.insertBefore(draggedItem, afterElement);
        }
    });
    const pageLimitSelector = document.getElementById('page-limit-selector');
    const resumePage = document.getElementById('resume-page');
    
    function checkPageOverflow() {
        if (pageLimitSelector.value === 'one-page') {
            const isOverflowing = resumePage.scrollHeight > resumePage.clientHeight;
            resumePage.classList.toggle('overflowing', isOverflowing);
        } else {
            resumePage.classList.remove('overflowing');
        }
    }
    
    pageLimitSelector.addEventListener('change', () => {
        resumePage.classList.toggle('one-page-limit', pageLimitSelector.value === 'one-page');
        checkPageOverflow();
    });

    // Re-check overflow whenever the content might change
    const formSection = document.querySelector('.form-section');
    formSection.addEventListener('input', checkPageOverflow);
    formSection.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn') || e.target.classList.contains('remove-btn')) {
            // Use a small timeout to allow the DOM to update before checking height
            setTimeout(checkPageOverflow, 100);
        }
    });
    // Photo Uploader
    document.getElementById('input-photo').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoPreview = document.getElementById('preview-photo');
                photoPreview.src = e.target.result;
                photoPreview.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    // Template Selector
    document.getElementById('template-selector').addEventListener('change', function(event) {
        const previewSection = document.getElementById('resumeContent');
        previewSection.classList.remove('template-classic', 'template-modern');
        if (event.target.value === 'modern') {
            previewSection.classList.add('template-modern');
        } else {
            previewSection.classList.add('template-classic');
        }
    });

    // Save/Load Data
    document.getElementById('saveDataBtn').addEventListener('click', saveData);
    document.getElementById('loadDataInput').addEventListener('change', loadData);
}

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

// --- UNDO/REDO LOGIC ---
function saveOrder() {
    const currentOrder = [...document.querySelectorAll('#resume-sections .section')].map(el => el.dataset.id);
    undoStack.push(currentOrder);
    redoStack = []; // Clear redo stack on new action
}
document.getElementById('undoBtn').addEventListener('click', () => {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        const lastOrder = undoStack[undoStack.length - 1];
        restoreOrder(lastOrder);
    }
});
document.getElementById('redoBtn').addEventListener('click', () => {
    if (redoStack.length > 0) {
        const nextOrder = redoStack.pop();
        undoStack.push(nextOrder);
        restoreOrder(nextOrder);
    }
});
function restoreOrder(order) {
    const container = document.getElementById('resume-sections');
    const sections = new Map([...container.querySelectorAll('.section')].map(el => [el.dataset.id, el]));
    order.forEach(id => container.appendChild(sections.get(id)));
}

// --- SAVE/LOAD DATA ---
function saveData() {
    const data = {
        inputs: {},
        textareas: {},
        dynamic: {}
    };
    // Save simple inputs and textareas
    document.querySelectorAll('.form-section input[type="text"], .form-section input[type="email"], .form-section input[type="tel"], .form-section input[type="url"], .form-section select').forEach(el => data.inputs[el.id] = el.value);
    document.querySelectorAll('.form-section textarea').forEach(el => data.textareas[el.id] = el.value);
    
    // Save dynamic sections
    const dynamicSections = {
        'education-inputs': ['institution', 'degree', 'gpa', 'location', 'dates'],
        'experience-inputs': ['role', 'company', 'link', 'dates', 'desc'],
        'certifications-inputs': ['title', 'issuer', 'date', 'desc'],
        'project-input': ['title', 'link', 'desc']
    };
    for (const className in dynamicSections) {
        data.dynamic[className] = [];
        document.querySelectorAll(`#${className.replace('-input', 's')} > .${className}`).forEach(section => {
            const entry = {};
            dynamicSections[className].forEach(field => {
                entry[field] = section.querySelector(`.${className.split('-')[0]}-${field}`).value;
            });
            data.dynamic[className].push(entry);
        });
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'resume-data.json');
}

function loadData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            // Load simple inputs and textareas
            Object.keys(data.inputs).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = data.inputs[id];
            });
            Object.keys(data.textareas).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = data.textareas[id];
            });

            // Trigger input event for all loaded fields to update preview
            document.querySelectorAll('.form-section input, .form-section textarea, .form-section select').forEach(el => el.dispatchEvent(new Event('input')));
        };
        reader.readAsText(file);
    }
}

// --- UTILITY FUNCTIONS ---
function clearAndReload() {
    sessionStorage.clear();
    window.location.reload();
}

function autofillResume() {
    const dummyData = {
        'input-name': 'Amelia Chen',
        'input-email': 'amelia.chen@email.com',
        'input-phone': '+1-555-010-2345',
        'input-linkedin': 'https://linkedin.com/in/ameliachen',
        'input-github': 'https://github.com/ameliachen',
        'input-about': 'Highly motivated and detail-oriented software engineer with 5 years of experience in developing scalable web applications. Proficient in full-stack development with a strong focus on user-centric design and performance optimization. Eager to contribute to a dynamic team and tackle challenging projects.',
        'education-institution': 'University of Technology',
        'education-degree': 'B.S. in Computer Science',
        'education-gpa': '3.9',
        'education-location': 'Metropolis, USA',
        'education-dates': '2015 - 2019',
        'input-languages': 'JavaScript (ES6+), Python, HTML5, CSS3',
        'input-frameworks': 'React, Node.js, Express, Django',
        'input-tools': 'Git, Docker, Webpack, Jenkins',
        'input-platforms': 'AWS, Vercel, Firebase',
        'input-soft-skills': 'Agile Methodologies, Team Collaboration, Problem Solving, Communication',
        'experience-role': 'Senior Software Engineer',
        'experience-company': 'Innovatech Solutions Inc.',
        'experience-link': 'https://innovatech.com',
        'experience-dates': '2021 - Present',
        'experience-desc': 'Led the development of a new client-facing analytics dashboard, improving data visualization and user engagement by 30%.\nMentored junior developers, providing code reviews and guidance on best practices.',
        'certificate-title': 'AWS Certified Solutions Architect',
        'certificate-issuer': 'Amazon Web Services',
        'certificate-date': '2022',
        'certificate-desc': 'Validated technical expertise in designing and deploying scalable, highly available, and fault-tolerant systems on AWS.',
        'project-title': 'Real-Time Collaborative Code Editor',
        'project-link': 'https://github.com/ameliachen/code-editor',
        'project-desc': 'Developed a web-based code editor using React and WebSockets, allowing multiple users to edit code simultaneously.\nImplemented syntax highlighting for multiple languages.'
    };
    for (const id in dummyData) {
        const element = document.getElementById(id);
        if (element) {
            element.value = dummyData[id];
            element.dispatchEvent(new Event('input'));
        }
    }
}

async function improveText(textareaId) {
    const textarea = document.getElementById(textareaId);
    const suggestionBox = document.getElementById(`suggestion-${textareaId}`);
    let text = textarea.value;

    suggestionBox.classList.add("loading");
    suggestionBox.style.display = "block";
    suggestionBox.innerText = "Checking for improvements...";

    try {
        const response = await fetch("https://api.languagetool.org/v2/check", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ text: text, language: "en-US" })
        });
        const data = await response.json();
        let improved = text;
        data.matches.sort((a, b) => b.offset - a.offset).forEach(match => {
            if (match.replacements.length > 0) {
                improved = improved.slice(0, match.offset) + match.replacements[0].value + improved.slice(match.offset + match.length);
            }
        });
        
        suggestionBox.classList.remove("loading");
        if (improved !== text) {
            suggestionBox.innerHTML = `✨ <strong>Suggested:</strong> "${improved}"`;
        } else {
            suggestionBox.innerText = "✅ Your text looks good!";
        }
    } catch (error) {
        suggestionBox.classList.remove("loading");
        suggestionBox.innerText = "❌ Error checking grammar.";
        console.error(error);
    }
}