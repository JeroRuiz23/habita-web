// Protección de páginas privadas: oculta la página hasta confirmar la sesión y, si no hay sesión, redirige al login.
// IMPORTANTE: esto protege la pantalla (experiencia de usuario). Los DATOS privados deben protegerse en el servidor
// con reglas de Firebase (por ejemplo Firestore: allow read, write: if request.auth != null && request.auth.uid == userId).
import { watchUser, isConfigured } from './auth.js';
import { SITE, DEMO_MODE } from './config.js';

const demoUser = () => ({ isDemo: true, displayName: 'Usuario demo', email: 'demo@habita.co', emailVerified: true, metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() } });

export function requireAuth() {
  return new Promise((resolve) => {
    const stop = watchUser((user) => {
      if (user) { document.body.classList.remove('guarded'); resolve(user); return; }
      if (DEMO_MODE) { document.body.classList.remove('guarded'); resolve(demoUser()); return; }
      const next = location.pathname.split('/').pop() + location.search;
      location.replace(`${SITE.authPage}?next=${encodeURIComponent(next)}${isConfigured ? '' : '&setup=1'}`);
    });
    window.addEventListener('pagehide', stop);
  });
}
