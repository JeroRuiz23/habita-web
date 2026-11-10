#!/usr/bin/env bash
# Instala el mapa de Apple dentro de la app y sincroniza con iOS. Se puede repetir sin problema.
set -e
cd "$(dirname "$0")/.."
node -e "const f='capacitor.config.json',c=JSON.parse(require('fs').readFileSync(f));c.backgroundColor='#F3F5F9';c.plugins=c.plugins||{};c.plugins.SplashScreen=Object.assign(c.plugins.SplashScreen||{},{backgroundColor:'#F3F5F9'});c.plugins.StatusBar=Object.assign(c.plugins.StatusBar||{},{backgroundColor:'#F3F5F9'});require('fs').writeFileSync(f,JSON.stringify(c,null,2))"
echo "1/4 Instalando el plugin del mapa de Apple..."
npm install ./native/habita-map
echo "2/4 Preparando la app web..."
npm run build
echo "3/4 Sincronizando con iOS..."
npx cap sync
bash scripts/patch-native.sh
echo "4/4 Generando ícono y pantalla de inicio nuevos..."
npm run assets || echo "(No se pudieron generar los íconos; puedes repetirlo con: npm run assets)"
echo ""
echo "Listo. Ahora en Xcode: Product > Clean Build Folder (Shift+Cmd+K) y luego Play."
