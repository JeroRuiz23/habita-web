// Contenido editable del sitio. Cambia textos, imágenes y páginas sin tocar el resto del código.
// Modo demo: permite entrar a las pantallas privadas sin iniciar sesión. Ponlo en false cuando Firebase esté listo.
export const DEMO_MODE = true;

export const SITE = {
  name: 'Habita',
  tagline: 'Encuentra el lugar donde empieza tu vida',
  home: 'index.html',
  authPage: 'auth.html',
  privateHome: 'perfil.html' // a donde se va después de iniciar sesión
};

export const NAV = [
  { label: 'Inicio', href: 'index.html#inicio', id: 'home' },
  { label: 'Qué ofrecemos', href: 'index.html#servicios', id: 'servicios' },
  { label: 'Cómo funciona', href: 'index.html#como-funciona', id: 'como' },
  { label: 'Abrir la app', href: 'app/', id: 'app' },
  { label: 'Mi perfil', href: 'perfil.html', id: 'perfil' }
];

// Para usar fotos reales: guarda los archivos en web/img/ y cambia `src`.
export const SLIDES = [
  { src: 'img/slide-1.svg', alt: 'Casa con jardín al atardecer', eyebrow: 'Casas', title: 'Tu casa, a la medida de tu vida', text: 'Casas y apartamentos para comprar o arrendar en toda Colombia.', cta: { label: 'Empezar', href: 'app/' } },
  { src: 'img/slide-2.svg', alt: 'Edificios de apartamentos iluminados', eyebrow: 'Apartamentos', title: 'Vive cerca de todo lo que necesitas', text: 'Descubre qué hay alrededor de cada vivienda antes de visitarla.', cta: { label: 'Ver qué ofrecemos', href: '#servicios' } },
  { src: 'img/slide-3.svg', alt: 'Residencia estudiantil', eyebrow: 'Residencias estudiantiles', title: 'Un lugar seguro para estudiar', text: 'Apartaestudios y residencias cerca de tu universidad.', cta: { label: 'Cómo funciona', href: '#como-funciona' } },
  { src: 'img/slide-4.svg', alt: 'Proyecto en obra gris con grúa', eyebrow: 'Inversión y obra gris', title: 'Invierte hoy, construye tu futuro', text: 'Oportunidades de inversión y proyectos en obra gris con proyección clara.', cta: { label: 'Iniciar sesión', href: 'auth.html' } }
];
export const CAROUSEL_MS = 5500;
