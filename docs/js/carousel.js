import { SLIDES, CAROUSEL_MS } from './config.js';
import { icon } from './ui.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function initCarousel(root) {
  root.innerHTML = `<div class="slides" aria-live="off">${SLIDES.map((s, i) => `
    <article class="slide" role="group" aria-roledescription="diapositiva" aria-label="${i + 1} de ${SLIDES.length}">
      <img src="${esc(s.src)}" alt="${esc(s.alt)}" ${i ? 'loading="lazy"' : ''} decoding="async">
      <div class="slide-copy"><div class="container">
        <span class="eyebrow">${esc(s.eyebrow)}</span>
        <h1>${esc(s.title)}</h1>
        <p class="lead">${esc(s.text)}</p>
        <div class="cta"><a class="btn btn-primary" href="${esc(s.cta.href)}">${esc(s.cta.label)}</a></div>
      </div></div>
    </article>`).join('')}</div>
    <button class="c-btn c-prev" aria-label="Imagen anterior">${icon.prev}</button>
    <button class="c-btn c-next" aria-label="Imagen siguiente">${icon.next}</button>
    <div class="c-dots" role="tablist" aria-label="Elegir imagen">${SLIDES.map((_, i) => `<button role="tab" aria-label="Ir a la imagen ${i + 1}"></button>`).join('')}</div>`;
  root.style.setProperty('--dur', CAROUSEL_MS + 'ms');

  const slides = [...root.querySelectorAll('.slide')], dots = [...root.querySelectorAll('.c-dots button')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = -1, timer = null, hold = false;

  function show(n) {
    n = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('active', k === n); s.setAttribute('aria-hidden', k !== n); });
    dots.forEach((d, k) => {
      d.classList.toggle('active', k === n); d.setAttribute('aria-selected', k === n);
      d.innerHTML = k === n ? '<i></i>' : ''; // reinicia la barra de progreso
    });
    i = n; schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (reduce || hold) return;
    timer = setTimeout(() => show(i + 1), CAROUSEL_MS);
  }
  const pause = () => { hold = true; root.classList.add('paused'); clearTimeout(timer); };
  const resume = () => { if (document.hidden) return; hold = false; root.classList.remove('paused'); show(i); };

  root.querySelector('.c-prev').addEventListener('click', () => show(i - 1));
  root.querySelector('.c-next').addEventListener('click', () => show(i + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', resume);
  root.addEventListener('focusin', pause);
  root.addEventListener('focusout', resume);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : resume()));
  root.tabIndex = 0;
  root.setAttribute('role', 'region'); root.setAttribute('aria-roledescription', 'carrusel'); root.setAttribute('aria-label', 'Imágenes destacadas');
  root.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });

  // deslizar con el dedo
  let x0 = null;
  root.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' && !e.target.closest('a,button')) x0 = e.clientX; });
  root.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
  });
  root.addEventListener('pointercancel', () => { x0 = null; });

  show(0);
}
