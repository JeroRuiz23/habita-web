import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const body = readFileSync(new URL('../src/app.html', import.meta.url), 'utf8');
const head = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;-webkit-text-size-adjust:100%}img{max-width:100%}[hidden]{display:none!important}</style>
`;
mkdirSync(new URL('../www/', import.meta.url), { recursive: true });
writeFileSync(new URL('../www/index.html', import.meta.url), head + body + '\n</body>\n</html>\n');
console.log('www/index.html generado');
