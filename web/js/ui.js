// Piezas visuales compartidas: logo, cabecera, pie de página y menú de usuario.
import { SITE, NAV } from './config.js';
import { watchUser, logout } from './auth.js';

const keySVG = '<svg class="k" viewBox="0 0 130 270" aria-hidden="true"><g fill="#ff9100"><circle cx="65" cy="62" r="40" fill="none" stroke="#ff9100" stroke-width="40"/><rect x="48" y="104" width="34" height="166" rx="17"/><rect x="82" y="158" width="34" height="17" rx="3"/><rect x="82" y="198" width="26" height="17" rx="3"/></g></svg>';
const hSVG = '<svg class="h" viewBox="0 0 250 260" aria-hidden="true"><g fill="#ff9100"><rect width="60" height="258"/><rect x="186" width="56" height="258"/><path d="M58 112L123 60L188 112V172L123 120L58 172Z"/><rect x="160" y="62" width="28" height="40"/><rect x="91" y="165" width="28" height="28" rx="2"/><rect x="123" y="165" width="28" height="28" rx="2"/><rect x="91" y="197" width="28" height="28" rx="2"/><rect x="123" y="197" width="28" height="28" rx="2"/></g></svg>';

/** Logo "Habita": la H es una casa y la i es una llave. */
export function logo({ dark = false, tag = 'span', href = '', letters = false } = {}) {
  const l = (c, n) => `<span${letters ? ` class="l${n}"` : ''}>${c}</span>`;
  const inner = `${hSVG}${l('a', 1)}${l('b', 2)}${keySVG}${l('t', 3)}${l('a', 4)}`;
  const label = 'aria-label="Habita"';
  return href ? `<a class="wm${dark ? ' dark' : ''}" href="${href}" ${label}>${inner}</a>` : `<${tag} class="wm${dark ? ' dark' : ''}" ${label} role="img">${inner}</${tag}>`;
}

const icon = {
  menu: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  prev: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>'
};
export { icon };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const initials = (u) => ((u.displayName || u.email || '?').trim()[0] || '?').toUpperCase();

export function renderLayout(active) {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `<div class="container">
    ${logo({ href: SITE.home })}
    <nav class="nav" id="nav" aria-label="Principal">${NAV.map((n) => `<a href="${n.href}"${n.id === active ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}</nav>
    <div class="header-end" id="authArea"></div>
    <button class="menu-btn" id="menuBtn" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav">${icon.menu}</button>
  </div>`;
  document.body.prepend(header);
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `<div class="container">${logo({})}<span>© ${new Date().getFullYear()} ${SITE.name}. Hecho en Colombia.</span></div>`;
  footer.querySelector('.wm').style.setProperty('--wm', '24px');
  document.body.append(footer);

  const nav = header.querySelector('#nav'), btn = header.querySelector('#menuBtn');
  btn.addEventListener('click', () => { const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });

  const area = header.querySelector('#authArea');
  watchUser((user) => {
    nav.querySelector('.nav-auth')?.remove();
    if (!user) {
      nav.insertAdjacentHTML('beforeend', `<a class="nav-auth" href="${SITE.authPage}">Iniciar sesión</a>`);
      area.innerHTML = `<a class="btn btn-ghost" href="${SITE.authPage}">Iniciar sesión</a><a class="btn btn-primary" href="${SITE.authPage}#registro">Crear cuenta</a>`;
      return;
    }
    area.innerHTML = `<div class="user-menu"><button class="avatar-btn" id="uBtn" aria-haspopup="true" aria-expanded="false"><span class="avatar">${esc(initials(user))}</span><span class="name">${esc((user.displayName || 'Mi cuenta').split(' ')[0])}</span></button>
      <div class="dropdown" id="uDrop" hidden><div class="who"><b>${esc(user.displayName || 'Usuario')}</b><small>${esc(user.email || '')}</small></div><a href="${SITE.privateHome}">Mi perfil</a><button id="outBtn">Cerrar sesión</button></div></div>`;
    const b = area.querySelector('#uBtn'), d = area.querySelector('#uDrop');
    b.addEventListener('click', (e) => { e.stopPropagation(); d.hidden = !d.hidden; b.setAttribute('aria-expanded', String(!d.hidden)); });
    document.addEventListener('click', (e) => { if (!d.contains(e.target)) { d.hidden = true; b.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') d.hidden = true; });
    area.querySelector('#outBtn').addEventListener('click', async () => { await logout(); location.href = SITE.home; });
  });
}
