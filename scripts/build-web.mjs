// Genera la app web (www/index.html) a partir de src/app.html y publica las copias del sitio.
// - Las imágenes se escriben en src/app.html como @@img/archivo@@ y aquí se incrustan desde web/img/,
//   así la app funciona sola (iPhone, Android y la demo web) sin depender de rutas.
// - Copia la app a web/app/ y luego todo web/ a docs/ (la carpeta que publica GitHub Pages).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const TYPES = { svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg' };
const cache = {};
const dataUri = (name) => {
  if (!cache[name]) {
    const ext = name.split('.').pop();
    cache[name] = `data:${TYPES[ext]};base64,` + readFileSync(new URL(`web/img/${name}`, root)).toString('base64');
  }
  return cache[name];
};

const body = readFileSync(new URL('src/app.html', root), 'utf8').replace(/@@img\/([\w.-]+)@@/g, (_, n) => dataUri(n));
const head = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#394a3f">
<link rel="icon" href="${dataUri('logo-icon.png')}">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;-webkit-text-size-adjust:100%}img{max-width:100%}[hidden]{display:none!important}</style>
`;
const html = head + body + '\n</body>\n</html>\n';

mkdirSync(new URL('www/', root), { recursive: true });
writeFileSync(new URL('www/index.html', root), html);
mkdirSync(new URL('web/app/', root), { recursive: true });
writeFileSync(new URL('web/app/index.html', root), html);
rmSync(new URL('docs/', root), { recursive: true, force: true });
cpSync(new URL('web/', root), new URL('docs/', root), { recursive: true });
writeFileSync(new URL('docs/.nojekyll', root), '');
console.log('www/index.html, web/app/ y docs/ generados');
