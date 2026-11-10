// Piezas visuales compartidas: logo, cabecera, pie de página y menú de usuario.
import { SITE, NAV } from './config.js';
import { watchUser, logout } from './auth.js';


/** Logo "Habita" (imagen oficial). Fondo oscuro: letras blancas; fondo claro: letras verdes. */
export function logo({ dark = false, tag = 'span', href = '' } = {}) {
  const img = `<img src="img/${dark ? 'logo-light' : 'logo-dark'}.png" alt="Habita" draggable="false">`;
  return href ? `<a class="wm" href="${href}" aria-label="Habita">${img}</a>` : `<${tag} class="wm">${img}</${tag}>`;
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
