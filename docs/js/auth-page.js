import { renderLayout, logo } from './ui.js';
import { SITE } from './config.js';
import { register, login, resetPassword, watchUser, friendlyError, isConfigured, demoActive, canSubmit } from './auth.js';

renderLayout('');
document.getElementById('sideLogo').innerHTML = logo({});
document.getElementById('sideLogo').firstElementChild.style.setProperty('--wm', '44px');

const $ = (id) => document.getElementById(id);
const alertBox = $('alert');
const panels = { login: $('p-login'), registro: $('p-registro'), reset: $('p-reset') };
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// destino después de entrar: solo rutas internas (evita redirecciones a otros sitios)
function nextUrl() {
  const n = new URLSearchParams(location.search).get('next');
  return n && /^[\w\-./?=&%]+$/.test(n) && !n.includes('//') && !n.startsWith('/') ? n : SITE.privateHome;
}

function say(type, text) {
  alertBox.innerHTML = text ? `<div class="msg ${type}">${text.replace(/</g, '&lt;')}</div>` : '';
}
function show(name) {
  Object.entries(panels).forEach(([k, el]) => { el.hidden = k !== name; });
  const tab = name === 'reset' ? 'login' : name;
  $('tabs').hidden = name === 'reset';
  ['login', 'registro'].forEach((k) => $('tab-' + k).setAttribute('aria-selected', String(k === tab)));
  say('', '');
  document.querySelectorAll('input.invalid').forEach((i) => i.classList.remove('invalid'));
  history.replaceState(null, '', location.pathname + location.search + (name === 'registro' ? '#registro' : ''));
}
$('tab-login').addEventListener('click', () => show('login'));
$('tab-registro').addEventListener('click', () => show('registro'));
$('toReset').addEventListener('click', () => { show('reset'); $('x-email').value = $('l-email').value; $('x-email').focus(); });
$('toLogin').addEventListener('click', () => show('login'));
show(location.hash === '#registro' ? 'registro' : 'login');

// mostrar/ocultar contraseña
const eyeOn = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const eyeOff = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M10.600 6.100A9.800 9.800 0 0 1 12 5c6.500 0 10 7 10 7a17 17 0 0 1-3.200 4M6.300 6.300A17 17 0 0 0 2 12s3.500 7 10 7a9.700 9.700 0 0 0 4.200-1"/></svg>';
document.querySelectorAll('.eye').forEach((b) => {
  b.innerHTML = eyeOn;
  b.addEventListener('click', () => {
    const i = $(b.dataset.for), hide = i.type === 'password';
    i.type = hide ? 'text' : 'password'; b.innerHTML = hide ? eyeOff : eyeOn;
    b.setAttribute('aria-label', hide ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });
});

if (!isConfigured) {
  const bn = $('setupBanner'); bn.hidden = false;
  if (demoActive) bn.querySelector('.container').innerHTML = '<strong>Modo demo.</strong> Puedes crear una cuenta o entrar con cualquier correo para recorrer la página. No se guarda ninguna contraseña.';
  else document.querySelectorAll('form button[type=submit]').forEach((b) => (b.disabled = true));
}

function mark(ids) { ids.forEach((id) => $(id).classList.add('invalid')); if (ids[0]) $(ids[0]).focus(); }
function busy(form, on, label) {
  const b = form.querySelector('button[type=submit]');
  if (on) { b.dataset.t = b.textContent; b.textContent = label; } else if (b.dataset.t) b.textContent = b.dataset.t;
  b.disabled = on || !canSubmit;
}
const clean = () => document.querySelectorAll('input.invalid').forEach((i) => i.classList.remove('invalid'));
document.addEventListener('input', (e) => e.target.classList.remove('invalid'));

$('f-login').addEventListener('submit', async (e) => {
  e.preventDefault(); clean();
  const email = $('l-email').value.trim(), password = $('l-pass').value;
  const bad = [];
  if (!email) bad.push('l-email'); if (!password) bad.push('l-pass');
  if (bad.length) { mark(bad); return say('error', 'Completa tu correo y tu contraseña para continuar.'); }
  if (!emailRe.test(email)) { mark(['l-email']); return say('error', friendlyError({ code: 'auth/invalid-email' })); }
  busy(e.target, true, 'Entrando…');
  try { await login({ email, password, remember: $('l-remember').checked }); location.href = nextUrl(); }
  catch (err) { say('error', friendlyError(err)); mark(['l-pass']); busy(e.target, false); }
});

$('f-registro').addEventListener('submit', async (e) => {
  e.preventDefault(); clean();
  const name = $('r-name').value.trim(), email = $('r-email').value.trim(), p1 = $('r-pass').value, p2 = $('r-pass2').value;
  const bad = [];
  if (!name) bad.push('r-name'); if (!email) bad.push('r-email'); if (!p1) bad.push('r-pass'); if (!p2) bad.push('r-pass2');
  if (bad.length) { mark(bad); return say('error', 'Completa todos los campos para crear tu cuenta.'); }
  if (name.length < 2) { mark(['r-name']); return say('error', 'Escribe tu nombre (mínimo 2 letras).'); }
  if (!emailRe.test(email)) { mark(['r-email']); return say('error', friendlyError({ code: 'auth/invalid-email' })); }
  if (p1.length < 8) { mark(['r-pass']); return say('error', friendlyError({ code: 'auth/weak-password' })); }
  if (p1 !== p2) { mark(['r-pass2']); return say('error', 'Las contraseñas no coinciden.'); }
  busy(e.target, true, 'Creando cuenta…');
  try { await register({ name, email, password: p1 }); location.href = nextUrl(); }
  catch (err) { say('error', friendlyError(err)); if (err.code === 'auth/email-already-in-use') mark(['r-email']); busy(e.target, false); }
});

$('f-reset').addEventListener('submit', async (e) => {
  e.preventDefault(); clean();
  const email = $('x-email').value.trim();
  if (!email) { mark(['x-email']); return say('error', 'Escribe tu correo electrónico.'); }
  if (!emailRe.test(email)) { mark(['x-email']); return say('error', friendlyError({ code: 'auth/invalid-email' })); }
  busy(e.target, true, 'Enviando…');
  try {
    await resetPassword(email);
    say('ok', 'Si el correo está registrado, te enviamos un enlace para restablecer la contraseña. Revisa también la carpeta de spam.');
  } catch (err) { say('error', friendlyError(err)); }
  busy(e.target, false);
});

// si ya hay sesión, no tiene sentido ver el login
watchUser((u) => { if (u) location.replace(nextUrl()); });
