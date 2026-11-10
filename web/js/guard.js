// Protección de páginas privadas: oculta la página hasta confirmar la sesión y, si no hay sesión, redirige al login.
// IMPORTANTE: esto protege la pantalla (experiencia de usuario). Los DATOS privados deben protegerse en el servidor
// con reglas de Firebase (por ejemplo Firestore: allow read, write: if request.auth != null && request.auth.uid == userId).
import { watchUser, isConfigured } from './auth.js';
import { SITE } from './config.js';

export function requireAuth() {
  return new Promise((resolve) => {
    const stop = watchUser((user) => {
      if (user) { document.body.classList.remove('guarded'); resolve(user); return; }
      const next = location.pathname.split('/').pop() + location.search;
      location.replace(`${SITE.authPage}?next=${encodeURIComponent(next)}${isConfigured ? '' : '&setup=1'}`);
    });
    window.addEventListener('pagehide', stop);
  });
}
