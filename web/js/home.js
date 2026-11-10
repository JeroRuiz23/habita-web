import { renderLayout, logo } from './ui.js';
import { initCarousel } from './carousel.js';

renderLayout('home');
initCarousel(document.getElementById('carousel'));

// Animación inicial del logo: una sola vez por visita, corta y se puede saltar.
const root = document.documentElement;
const seen = (() => { try { return sessionStorage.getItem('habita.intro') === '1'; } catch (_) { return false; } })();
if (!seen) {
  const el = document.createElement('div');
  el.className = 'intro'; el.setAttribute('role', 'presentation');
  el.innerHTML = `<div class="intro-inner">${logo({ letters: true })}<p class="tag">Encuentra tu lugar</p><div class="bar"><i></i></div></div><button class="skip" type="button">Saltar</button>`;
  document.body.append(el);
  document.body.classList.add('intro-on');
  const end = () => {
    if (el.classList.contains('done')) return;
    el.classList.add('done'); document.body.classList.remove('intro-on');
    try { sessionStorage.setItem('habita.intro', '1'); } catch (_) {}
    setTimeout(() => el.remove(), 800);
  };
  el.querySelector('.skip').addEventListener('click', end);
  setTimeout(end, matchMedia('(prefers-reduced-motion: reduce)').matches ? 600 : 2400);
}
root.classList.remove('intro-pending');
