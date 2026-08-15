// YASS Parfumerie — script.js

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

function highlightNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const sTop = section.offsetTop;
    const sHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= sTop && scrollY < sTop + sHeight) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`nav a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNav);

// Smooth image load fallback (already handled inline via onerror)
// Add active class styling via CSS if needed
document.head.insertAdjacentHTML('beforeend', `<style>
  nav ul li a.active {
    background: var(--gold);
    color: #1a1a2e;
  }
</style>`);
