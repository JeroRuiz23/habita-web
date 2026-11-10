# Habita — sitio web

Sitio estático (HTML, CSS y JavaScript con módulos). No necesita compilar nada.

```
web/
  index.html        Inicio: animación del logo + carrusel + secciones
  auth.html         Registro, inicio de sesión y recuperar contraseña
  perfil.html       Perfil (página protegida)
  css/styles.css    Estilos y colores de marca (variables al inicio)
  img/              Imágenes del carrusel y logo
  js/config.js      Textos del carrusel, menú y rutas (lo que más se edita)
  js/firebase-config.js   Llaves de tu proyecto Firebase  <-- hay que completarlo
  js/auth.js        Registro, login, logout, reset, errores en español
  js/guard.js       Protección de páginas privadas
  js/ui.js          Logo, cabecera, pie y menú de usuario
  js/carousel.js    Carrusel · js/home.js: intro del logo
```

## 1. Activar el sistema de cuentas (Firebase Authentication)

Las contraseñas las maneja Firebase (hash seguro en sus servidores); este código nunca las guarda.

1. Entra a https://console.firebase.google.com y crea un proyecto.
2. **Authentication → Método de acceso →** activa **Correo electrónico/contraseña**.
3. **Authentication → Configuración → Dominios autorizados →** agrega el dominio donde publicarás (por ejemplo `parra-smn.github.io`).
4. **Configuración del proyecto → Tus apps → Web (`</>`)** y copia `apiKey`, `authDomain`, `projectId` y `appId` en `web/js/firebase-config.js`.
5. Opcional: en **Authentication → Plantillas** traduce el correo de recuperación y de verificación al español.

Mientras `firebase-config.js` tenga los valores `TU_...`, la web muestra un aviso y los formularios quedan desactivados.

## 2. Ver el sitio en tu computador

Desde la carpeta `web`: `npx serve .` (o `python3 -m http.server`) y abre la dirección que aparezca. Abrir el archivo con doble clic no funciona porque usa módulos de JavaScript.

## 3. Publicar en GitHub Pages

Settings → Pages → Source: *GitHub Actions* o rama `main` con carpeta `/web` (si no aparece la carpeta, usa la acción "Deploy static content" apuntando a `web`).

## Seguridad

- `guard.js` oculta las páginas privadas a quien no inició sesión. Eso protege la pantalla, no los datos.
- Cuando guardes datos de usuarios (favoritos, metas), protégelos con reglas de Firebase, por ejemplo en Firestore:
  `allow read, write: if request.auth != null && request.auth.uid == userId;`
- Para una nueva página privada: pon `class="guarded"` en `<body>` y usa `const user = await requireAuth();` (mira `js/profile.js`).
- Firebase responde "correo o contraseña incorrectos" sin indicar cuál falló; es intencional, para no revelar qué correos tienen cuenta.
