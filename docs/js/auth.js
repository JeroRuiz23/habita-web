// Servicio de autenticación (Firebase Authentication). Las contraseñas nunca pasan por este código ni se guardan:
// viajan cifradas (HTTPS) directo a Firebase, que las almacena con hash seguro.
import { firebaseConfig, isConfigured } from './firebase-config.js';
import { DEMO_MODE } from './config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile, sendEmailVerification, setPersistence,
  browserLocalPersistence, browserSessionPersistence
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

export { isConfigured };
const auth = isConfigured ? getAuth(initializeApp(firebaseConfig)) : null;
/** Modo demo: sin Firebase, las pantallas funcionan con una sesión de práctica guardada solo en esta pestaña (nunca se guarda ninguna contraseña). */
export const demoActive = !auth && DEMO_MODE;
export const canSubmit = isConfigured || demoActive;
const DK = 'habita-demo';
const dget = () => { try { return JSON.parse(sessionStorage.getItem(DK)); } catch (_) { return null; } };
const dset = (v) => { try { v ? sessionStorage.setItem(DK, JSON.stringify(v)) : sessionStorage.removeItem(DK); } catch (_) {} };
const dUser = () => { const d = dget(); if (!d) return null; return { isDemo: true, displayName: d.name, email: d.email, emailVerified: true, metadata: { creationTime: d.since, lastSignInTime: new Date().toISOString() } }; };
if (auth) auth.languageCode = 'es';

function need() {
  if (!auth) { const e = new Error('Firebase no está configurado'); e.code = 'app/not-configured'; throw e; }
  return auth;
}

/** Llama a cb(user|null) ahora y en cada cambio de sesión. Devuelve la función para dejar de escuchar. */
export function watchUser(cb) {
  if (!auth) { cb(demoActive ? dUser() : null); return () => {}; }
  return onAuthStateChanged(auth, cb);
}
export const currentUser = () => (auth ? auth.currentUser : null);

export async function register({ name, email, password }) {
  if (demoActive) { dset({ name, email, since: new Date().toISOString() }); return dUser(); }
  const a = need();
  await setPersistence(a, browserLocalPersistence);
  const cred = await createUserWithEmailAndPassword(a, email, password);
  await updateProfile(cred.user, { displayName: name });
  try { await sendEmailVerification(cred.user); } catch (_) { /* no bloquea el registro */ }
  return cred.user;
}
export async function login({ email, password, remember }) {
  if (demoActive) { const n = email.split('@')[0]; dset({ name: n.charAt(0).toUpperCase() + n.slice(1), email, since: new Date().toISOString() }); return dUser(); }
  const a = need();
  await setPersistence(a, remember ? browserLocalPersistence : browserSessionPersistence);
  return (await signInWithEmailAndPassword(a, email, password)).user;
}
export const logout = () => (demoActive ? Promise.resolve(dset(null)) : signOut(need()));
export const resetPassword = (email) => (demoActive ? Promise.resolve() : sendPasswordResetEmail(need(), email));
export const resendVerification = () => (demoActive ? Promise.resolve() : sendEmailVerification(need().currentUser));
export async function updateName(name) {
  if (demoActive) { const d = dget() || {}; dset({ ...d, name }); return dUser(); }
  const a = need();
  await updateProfile(a.currentUser, { displayName: name });
  await a.currentUser.reload();
  return a.currentUser;
}

const ERRORS = {
  'auth/invalid-email': 'El correo no es válido. Revisa que tenga el formato nombre@dominio.com.',
  'auth/missing-email': 'Escribe tu correo electrónico.',
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  // Firebase unifica "correo incorrecto" y "contraseña incorrecta" en este código para no revelar qué correos existen.
  'auth/invalid-credential': 'Correo o contraseña incorrectos. Revísalos e inténtalo de nuevo.',
  'auth/invalid-login-credentials': 'Correo o contraseña incorrectos. Revísalos e inténtalo de nuevo.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Prueba iniciar sesión.',
  'auth/weak-password': 'La contraseña es muy débil. Usa al menos 8 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo otra vez.',
  'auth/network-request-failed': 'No hay conexión con el servidor. Revisa tu internet.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada. Contacta a soporte.',
  'auth/requires-recent-login': 'Por seguridad, vuelve a iniciar sesión para hacer este cambio.',
  'app/not-configured': 'El sistema de cuentas aún no está configurado. Falta pegar las llaves de Firebase en js/firebase-config.js.'
};
export const friendlyError = (e) => ERRORS[e && e.code] || 'Ocurrió un error inesperado. Inténtalo de nuevo.';
