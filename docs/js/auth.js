// Servicio de autenticación (Firebase Authentication). Las contraseñas nunca pasan por este código ni se guardan:
// viajan cifradas (HTTPS) directo a Firebase, que las almacena con hash seguro.
import { firebaseConfig, isConfigured } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile, sendEmailVerification, setPersistence,
  browserLocalPersistence, browserSessionPersistence
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

export { isConfigured };
const auth = isConfigured ? getAuth(initializeApp(firebaseConfig)) : null;
if (auth) auth.languageCode = 'es';

function need() {
  if (!auth) { const e = new Error('Firebase no está configurado'); e.code = 'app/not-configured'; throw e; }
  return auth;
}

/** Llama a cb(user|null) ahora y en cada cambio de sesión. Devuelve la función para dejar de escuchar. */
export function watchUser(cb) {
  if (!auth) { cb(null); return () => {}; }
  return onAuthStateChanged(auth, cb);
}
export const currentUser = () => (auth ? auth.currentUser : null);

export async function register({ name, email, password }) {
  const a = need();
  await setPersistence(a, browserLocalPersistence);
  const cred = await createUserWithEmailAndPassword(a, email, password);
  await updateProfile(cred.user, { displayName: name });
  try { await sendEmailVerification(cred.user); } catch (_) { /* no bloquea el registro */ }
  return cred.user;
}
export async function login({ email, password, remember }) {
  const a = need();
  await setPersistence(a, remember ? browserLocalPersistence : browserSessionPersistence);
  return (await signInWithEmailAndPassword(a, email, password)).user;
}
export const logout = () => signOut(need());
export const resetPassword = (email) => sendPasswordResetEmail(need(), email);
export const resendVerification = () => sendEmailVerification(need().currentUser);
export async function updateName(name) {
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
