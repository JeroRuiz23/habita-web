import { requireAuth } from './guard.js';
import { renderLayout, initials } from './ui.js';
import { logout, updateName, resendVerification, friendlyError } from './auth.js';
import { SITE } from './config.js';

const $ = (id) => document.getElementById(id);
const fmt = (s) => (s ? new Date(s).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : '—');
const say = (type, text) => { $('alert').innerHTML = text ? `<div class="msg ${type}">${text.replace(/</g, '&lt;')}</div>` : ''; };

const user = await requireAuth(); // si no hay sesión, redirige al login y no sigue
renderLayout('perfil');

function paint(u) {
  const name = u.displayName || 'Usuario';
  $('pAvatar').textContent = initials(u);
  $('pName').textContent = `Hola, ${name.split(' ')[0]}`;
  $('pEmail').textContent = u.email || '';
  $('iName').textContent = name; $('iEmail').textContent = u.email || '—';
  $('iVerif').innerHTML = u.emailVerified ? '<span class="badge ok">Verificado</span>' : '<span class="badge warn">Pendiente</span>';
  $('iSince').textContent = fmt(u.metadata.creationTime); $('iLast').textContent = fmt(u.metadata.lastSignInTime);
  $('verifyBox').hidden = !!u.emailVerified; $('nameIn').value = u.displayName || '';
}
paint(user);

$('nameForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = $('nameIn').value.trim();
  if (name.length < 2) return say('error', 'Escribe tu nombre (mínimo 2 letras).');
  try { const u = await updateName(name); paint(u); const n = document.querySelector('.avatar-btn .name'); if (n) n.textContent = (u.displayName || '').split(' ')[0]; say('ok', 'Nombre actualizado.'); }
  catch (err) { say('error', friendlyError(err)); }
});
$('resendBtn').addEventListener('click', async () => {
  try { await resendVerification(); say('ok', 'Listo, te enviamos un nuevo correo de verificación.'); }
  catch (err) { say('error', friendlyError(err)); }
});
$('outBtn').addEventListener('click', async () => { await logout(); location.href = SITE.home; });
