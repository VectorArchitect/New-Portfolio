//--------------------------
// LOADING SCREEN
//--------------------------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
});




// ------------------------------
// DARK MODE TOGGLE (DEFAULT: DARK)
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('dark-toggle');
  
  // Set dark mode as default
  document.body.classList.add('dark-mode');
  toggle.checked = true; // Set toggle to checked state
  
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
  });
});

// ------------------------------
// TYPING EFFECT
// ------------------------------
const textElement = document.getElementById('text-to-type');
// const dataText = ["Web-Developer", "Programmer", "Machine Learning Engineer"];
const dataText = ["Web-Developer", "Programmer"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = dataText[phraseIndex];
  const visibleText = currentPhrase.substring(0, charIndex);
  textElement.textContent = visibleText;

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex++;
    setTimeout(typeEffect, 100); // Typing speed
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 50); // Deleting speed
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      phraseIndex = (phraseIndex + 1) % dataText.length;
    }
    setTimeout(typeEffect, 1000); // Pause between transitions
  }
}

// Start typing effect after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeEffect, 500);
});

// ------------------------------
// NAVBAR ACTIVE LINK ON SCROLL
// ------------------------------
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('.section').forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ------------------------------
// SCROLL FADE-IN EFFECT
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  sections.forEach(section => observer.observe(section));
});



tsParticles.load("tsparticles", {
  fullScreen: { enable: false },
  background: { color: { value: "transparent" } },
  particles: {
    number: { value: 60, density: { enable: true, area: 800 } },
    color: { value: "#00ffe7" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    move: { enable: true, speed: 1, direction: "none", outModes: "bounce" },
    links: {
      enable: true,
      distance: 150,
      color: "#00ffe7",
      opacity: 0.4,
      width: 1
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { quantity: 4 }
    }
  },
  detectRetina: true
});