// Initialize icons when the optional CDN library is available.
window.lucide?.createIcons?.();

const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const sections = Array.from(document.querySelectorAll('section'));

function setMenuOpen(open) {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        setMenuOpen(!isOpen);
    });

    navItems.forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', event => {
        if (!navLinks.classList.contains('active')) return;

        const clickedMenu = menuToggle.contains(event.target);
        const clickedNavigation = navLinks.contains(event.target);
        if (!clickedMenu && !clickedNavigation) setMenuOpen(false);
    });

    window.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });
}

// Reveal sections only when the browser supports the observer and the visitor
// has not requested reduced motion. Otherwise, keep all content visible.
const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('js');

    const observer = new window.IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
} else {
    sections.forEach(section => section.classList.add('visible'));
}

// Highlight the exact navigation target for the section nearest the top.
function updateActiveLink() {
    const marker = window.scrollY + 150;
    let currentSection = '';

    sections.forEach(section => {
        if (section.offsetTop <= marker) currentSection = section.id;
    });

    navItems.forEach(link => {
        const isActive = Boolean(currentSection) &&
            link.getAttribute('href') === '#' + currentSection;

        link.classList.toggle('active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();
