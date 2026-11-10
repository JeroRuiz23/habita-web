// 1) Crea un proyecto en https://console.firebase.google.com
// 2) Authentication > Método de acceso > activa "Correo electrónico/contraseña"
// 3) Configuración del proyecto > Tus apps > Web (</>) y copia los valores aquí.
// Estos valores NO son secretos: identifican tu proyecto. La seguridad real la dan Firebase Auth y sus reglas.
export const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
  appId: 'TU_APP_ID'
};

export const isConfigured = !Object.values(firebaseConfig).some((v) => /^TU_/.test(v));
