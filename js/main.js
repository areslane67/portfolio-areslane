// Script commun à toutes les pages : menu mobile, en-tête au défilement,
// lien actif dans le menu, apparition des blocs et année du pied de page.

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

// Menu mobile
const isEnglish = document.documentElement.lang === 'en';
const menuLabels = isEnglish ? ['Open menu', 'Close menu'] : ['Ouvrir le menu', 'Fermer le menu'];

function setMenu(open) {
  if (!header || !toggle) return;
  header.toggleAttribute('data-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? menuLabels[1] : menuLabels[0]);
}

if (toggle && nav) {
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

// Fond de l'en-tête dès qu'on fait défiler la page
if (header && !header.classList.contains('is-solid')) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Lien du menu correspondant à la section visible (page d'accueil)
const sectionLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
if (sectionLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(sectionLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((a) => a.removeAttribute('aria-current'));
      byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

// Apparition douce des blocs
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// Année du pied de page
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
