// Theme Management
const toggle = document.getElementById("themeToggle")
const icon = toggle.querySelector("i")

// Check localStorage on load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    document.body.classList.add("dark")
    icon.classList.remove("fa-sun")
    icon.classList.add("fa-moon")
  } else {
    document.body.classList.remove("dark")
    icon.classList.remove("fa-moon")
    icon.classList.add("fa-sun")
  }
})

toggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark")
  if (isDark) {
    icon.classList.remove("fa-sun")
    icon.classList.add("fa-moon")
    icon.style.color = "white"
    localStorage.setItem("theme", "dark")
  } else {
    icon.classList.remove("fa-moon")
    icon.classList.add("fa-sun")
    icon.style.color = "#FFB300"
    localStorage.setItem("theme", "light")
  }

  toggle.style.transform = "scale(0.9)"
  setTimeout(() => {
    toggle.style.transform = "scale(1)"
  }, 150)
})

// Custom Cursor
const cursor = document.querySelector(".cursor")
const cursorFollower = document.querySelector(".cursor-follower")

let mouseX = 0
let mouseY = 0
let followerX = 0
let followerY = 0

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX
  mouseY = e.clientY

  cursor.style.left = mouseX + "px"
  cursor.style.top = mouseY + "px"
})

function animateFollower() {
  const distX = mouseX - followerX
  const distY = mouseY - followerY

  followerX += distX * 0.12
  followerY += distY * 0.12

  cursorFollower.style.left = followerX + "px"
  cursorFollower.style.top = followerY + "px"

  requestAnimationFrame(animateFollower)
}
animateFollower()

// Cursor interactions
document.querySelectorAll("button, input, textarea, a, .add-btn, .download-btn, .remove-btn").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("hover")
    cursorFollower.classList.add("hover")
  })

  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover")
    cursorFollower.classList.remove("hover")
  })

  el.addEventListener("mousedown", () => {
    cursor.classList.add("click")
    cursorFollower.classList.add("click")
  })

  el.addEventListener("mouseup", () => {
    cursor.classList.remove("click")
    cursorFollower.classList.remove("click")
  })
})

// Progress bar animation
function updateProgressBar() {
  const formInputs = document.querySelectorAll("input, textarea")
  let filledInputs = 0

  formInputs.forEach((input) => {
    if (input.value.trim() !== "") {
      filledInputs++
    }
  })

  const progress = (filledInputs / formInputs.length) * 100
  document.querySelector(".progress-fill").style.width = progress + "%"
}

// Live Preview Bindings
function bindInputToPreview(inputId, previewId, isLink = false) {
  const input = document.getElementById(inputId)
  const preview = document.getElementById(previewId)
  if (input && preview) {
    input.addEventListener("input", () => {
      if (isLink && input.value) {
        preview.innerHTML = `<a href="${input.value}" target="_blank">${input.value}</a>`
      } else {
        preview.textContent = input.value
      }
      updateProgressBar()
    })
  }
}

bindInputToPreview("input-name", "preview-name")
bindInputToPreview("input-email", "preview-email")
bindInputToPreview("input-phone", "preview-phone")
bindInputToPreview("input-linkedin", "preview-linkedin", true)
bindInputToPreview("input-github", "preview-github", true)
bindInputToPreview("input-about", "preview-about")
bindInputToPreview("input-languages", "preview-languages")
bindInputToPreview("input-frameworks", "preview-frameworks")
bindInputToPreview("input-tools", "preview-tools")
bindInputToPreview("input-platforms", "preview-platforms")
bindInputToPreview("input-soft-skills", "preview-soft-skills")

// handles live character counting
function setupCharacterCounter(inputId) {
  const inputElement = document.getElementById(inputId)
  const charCountElement = inputElement?.parentNode.querySelector(".char-count")
  if (inputElement && charCountElement) {
    const maxLength = 500
    const updateCount = () => {
      const currentLength = inputElement.value.length
      charCountElement.textContent = `${currentLength}/${maxLength} characters`
      if (currentLength > maxLength * 0.9) {
        charCountElement.style.color = "var(--error)"
      } else if (currentLength > maxLength * 0.8) {
        charCountElement.style.color = "var(--warning)"
      } else {
        charCountElement.style.color = "var(--text-muted)"
      }
    }
    updateCount()
    inputElement.addEventListener("input", updateCount)
  }
}

setupCharacterCounter("input-about")

// Dynamic Section Helpers
function createRemoveBtn() {
  const btn = document.createElement("button")
  btn.className = "remove-btn"
  btn.innerHTML = '<i class="fas fa-trash"></i>'
  return btn
}

function handleAddSection(buttonId, containerId, inputClass, previewContainerId, generateHTML) {
  const button = document.getElementById(buttonId)
  const container = document.getElementById(containerId)
  const previewContainer = document.getElementById(previewContainerId)

  if (button && container && previewContainer) {
    button.addEventListener("click", () => {
      const original = container.querySelector(`.${inputClass}`)
      const clone = original.cloneNode(true)
      clone.querySelectorAll("input, textarea").forEach((input) => (input.value = ""))

      const removeBtn = createRemoveBtn()
      removeBtn.addEventListener("click", () => {
        clone.style.transition = "all 0.3s ease"
        clone.style.opacity = "0"
        clone.style.transform = "translateX(-100%)"
        setTimeout(() => {
          clone.remove()
          updatePreviewList(container, previewContainer, inputClass, generateHTML)
          updateProgressBar()
        }, 300)
      })

      clone.appendChild(removeBtn)

      // Add animation
      clone.style.opacity = "0"
      clone.style.transform = "translateY(20px)"
      container.appendChild(clone)

      setTimeout(() => {
        clone.style.transition = "all 0.3s ease"
        clone.style.opacity = "1"
        clone.style.transform = "translateY(0)"
      }, 10)

      // Add event listeners
      clone.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("input", () => {
          updatePreviewList(container, previewContainer, inputClass, generateHTML)
          updateProgressBar()
        })
      })
    })

    container.addEventListener("input", () => {
      updatePreviewList(container, previewContainer, inputClass, generateHTML)
    })
  }
}

function updatePreviewList(container, previewContainer, inputClass, generateHTML) {
  const entries = container.querySelectorAll(`.${inputClass}`)
  previewContainer.innerHTML = ""
  entries.forEach((entry) => {
    const html = generateHTML(entry)
    if (html) previewContainer.innerHTML += html
  })
}

// Education Section
handleAddSection("add-education", "education-inputs", "education-inputs", "preview-education", (entry) => {
  const inst = entry.querySelector(".education-institution").value
  const deg = entry.querySelector(".education-degree").value
  const gpa = entry.querySelector(".education-gpa").value
  const loc = entry.querySelector(".education-location").value
  const dates = entry.querySelector(".education-dates").value
  if (inst || deg || gpa || loc || dates) {
    return `<li><strong>${inst}</strong>, ${deg}<br>GPA: ${gpa} | ${loc} | ${dates}</li>`
  }
  return ""
})

// Experience Section
handleAddSection("add-experience", "experience-inputs", "experience-inputs", "preview-experience", (entry) => {
  const role = entry.querySelector(".experience-role").value
  const comp = entry.querySelector(".experience-company").value
  const link = entry.querySelector(".experience-link").value
  const dates = entry.querySelector(".experience-dates").value
  const desc = entry
    .querySelector(".experience-desc")
    .value.trim()
    .split("\n")
    .filter((l) => l)
    .map((l) => `<li>${l}</li>`)
    .join("")
  if (role || comp || dates || desc) {
    return `
        <li>
          <strong>${role}</strong>, <a href="${link}" target="_blank">${comp}</a> | ${dates}
          <ul>${desc}</ul>
        </li>
      `
  }
  return ""
})

// Certificates Section
handleAddSection("add-certificate", "certifications-inputs", "certifications-inputs", "preview-cert", (entry) => {
  const title = entry.querySelector(".certificate-title").value
  const issuer = entry.querySelector(".certificate-issuer").value
  const date = entry.querySelector(".certificate-date").value
  const desc = entry
    .querySelector(".certificate-desc")
    .value.trim()
    .split("\n")
    .filter((l) => l)
    .map((l) => `<li>${l}</li>`)
    .join("")
  if (title || issuer || date || desc) {
    return `
        <li>
          <strong>${title}</strong> (${issuer}) | ${date}
          <ul>${desc}</ul>
        </li>
      `
  }
  return ""
})

// Projects Section
handleAddSection("add-project", "projects-inputs", "project-input", "preview-projects", (entry) => {
  const title = entry.querySelector(".project-title").value
  const link = entry.querySelector(".project-link").value
  const desc = entry
    .querySelector(".project-desc")
    .value.trim()
    .split("\n")
    .filter((l) => l)
    .map((l) => `<li>${l}</li>`)
    .join("")
  if (title || link || desc) {
    return `
        <li>
          <strong>${title}</strong>
          <div class="project-links"><a href="${link}" target="_blank">LINK</a></div>
          <ul>${desc}</ul>
        </li>
      `
  }
  return ""
})

// Autofill function
function autofillResume() {
  const sampleData = {
    "input-name": "Alex Johnson",
    "input-email": "alex.johnson@email.com",
    "input-phone": "+1-555-0123",
    "input-linkedin": "linkedin.com/in/alexjohnson",
    "input-github": "github.com/alexjohnson",
    "input-about":
      "Experienced full-stack developer with 5+ years of expertise in building scalable web applications. Passionate about clean code, user experience, and emerging technologies.",
    "input-languages": "JavaScript, TypeScript, Python, Java, Go",
    "input-frameworks": "React, Next.js, Node.js, Express, Django, Spring Boot",
    "input-tools": "Git, Docker, Kubernetes, VS Code, Figma, Postman",
    "input-platforms": "AWS, Google Cloud, Firebase, Vercel, Heroku",
    "input-soft-skills": "Leadership, Team Collaboration, Problem Solving, Communication",
  }

  Object.entries(sampleData).forEach(([id, value], index) => {
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.style.transform = "scale(1.05)"
        element.style.background = "rgba(239, 68, 68, 0.1)"
        element.value = value
        setTimeout(() => {
          element.style.transform = "scale(1)"
          element.style.background = ""
        }, 300)
      }
    }, index * 150)
  })

  setTimeout(() => {
    const firstEducation = document.querySelector(".education-inputs")
    if (firstEducation) {
      firstEducation.querySelector(".education-institution").value = "Stanford University"
      firstEducation.querySelector(".education-degree").value = "M.S. Computer Science"
      firstEducation.querySelector(".education-gpa").value = "3.8"
      firstEducation.querySelector(".education-location").value = "Stanford, CA"
      firstEducation.querySelector(".education-dates").value = "2018-2020"
    }

    const firstExperience = document.querySelector(".experience-inputs")
    if (firstExperience) {
      firstExperience.querySelector(".experience-role").value = "Senior Software Engineer"
      firstExperience.querySelector(".experience-company").value = "Tech Innovations Inc."
      firstExperience.querySelector(".experience-link").value = "https://techinnovations.com"
      firstExperience.querySelector(".experience-dates").value = "2020-Present"
      firstExperience.querySelector(".experience-desc").value =
        "Led development of microservices architecture serving 1M+ users\nImplemented CI/CD pipelines reducing deployment time by 60%\nMentored junior developers and conducted code reviews"
    }

    updateProgressBar()
  }, 2000)
}

// PDF Download
document.getElementById("downloadBtn").addEventListener("click", () => {
  const button = document.getElementById("downloadBtn")
  const originalText = button.innerHTML

  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...'
  button.disabled = true

  const content = document.getElementById("resumeContent")
  const options = {
    margin: 0.5,
    filename: "resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }

  window
    .html2pdf()
    .from(content)
    .set(options)
    .save()
    .then(() => {
      button.innerHTML = originalText
      button.disabled = false
      button.style.background = "var(--success)"
      setTimeout(() => {
        button.style.background = "var(--primary)"
      }, 2000)
    })
})

// DOCX Download
document.getElementById("downloadDocxBtn").addEventListener("click", () => {
  const button = document.getElementById("downloadDocxBtn")
  const originalText = button.innerHTML

  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating DOCX...'
  button.disabled = true

  const resumeContent = document.getElementById("resumeContent").cloneNode(true)
  resumeContent.querySelectorAll(".fade-in, .show").forEach((el) => el.classList.remove("fade-in", "show"))

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export HTML to Word</title></head>
      <body>${resumeContent.innerHTML}</body>
    </html>`

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "resume.doc"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => {
    button.innerHTML = originalText
    button.disabled = false
    button.style.background = "var(--success)"
    setTimeout(() => {
      button.style.background = "var(--secondary)"
    }, 2000)
  }, 1000)
})

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault()
    document.getElementById("downloadBtn").click()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault()
    document.getElementById("downloadDocxBtn").click()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "r") {
    e.preventDefault()
    autofillResume()
  }
})

// Ripple effect
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span")
    const rect = this.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    this.appendChild(ripple)
    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
})

// Ripple styles
const rippleStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}
@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`

const styleSheet = document.createElement("style")
styleSheet.textContent = rippleStyles
document.head.appendChild(styleSheet)

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show")
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el)
  })

  // Setup character counters for all textareas
  document.querySelectorAll("textarea").forEach((textarea) => {
    const maxLength = 500
    const charCount = textarea.parentNode.querySelector(".char-count")
    if (charCount) {
      textarea.addEventListener("input", () => {
        const currentLength = textarea.value.length
        charCount.textContent = `${currentLength}/${maxLength} characters`
        if (currentLength > maxLength * 0.9) {
          charCount.style.color = "var(--error)"
        } else if (currentLength > maxLength * 0.8) {
          charCount.style.color = "var(--warning)"
        } else {
          charCount.style.color = "var(--text-muted)"
        }
      })
    }
  })

  updateProgressBar()
})

window.history.scrollRestoration = "manual"
window.scrollTo(0, 0)

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".fade-in").forEach((el) => {
    setTimeout(() => {
      el.classList.add("show")
    }, 500)
  })
} else {
  document.querySelectorAll(".cursor, .cursor-follower").forEach((el) => {
    el.style.display = "none"
  })
  document.body.style.cursor = "auto"
}

// Tooltips
document.getElementById("downloadBtn").title = "Download PDF (Ctrl+S)"
document.getElementById("downloadDocxBtn").title = "Download DOCX (Ctrl+D)"
const autofillBtn = document.querySelector('.btn-icon[onclick="autofillResume()"]')
if (autofillBtn) {
  autofillBtn.title = "Autofill Resume (Ctrl+R)"
}

// Make autofillResume globally available
window.autofillResume = autofillResume

// Declare html2pdf variable
window.html2pdf =
  window.html2pdf ||
  function () {
    console.error("html2pdf is not defined. Please import it before using.")
    return {
      set: () => {
        return this
      },
      from: () => {
        return this
      },
      save: () => {
        return Promise.resolve()
      },
    }
  }
