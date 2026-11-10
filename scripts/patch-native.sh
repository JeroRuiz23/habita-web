#!/usr/bin/env bash
# Agrega los permisos de cámara, galería y ubicación a los proyectos nativos.
# Se puede ejecutar varias veces sin duplicar nada.
set -e
cd "$(dirname "$0")/.."

PLIST="ios/App/App/Info.plist"
if [ -f "$PLIST" ] && command -v /usr/libexec/PlistBuddy >/dev/null 2>&1; then
  add() { /usr/libexec/PlistBuddy -c "Delete :$1" "$PLIST" 2>/dev/null || true; /usr/libexec/PlistBuddy -c "Add :$1 string $2" "$PLIST"; }
  add NSCameraUsageDescription "Habita usa la cámara para que tomes las fotos de tu propiedad."
  add NSPhotoLibraryUsageDescription "Habita necesita acceder a tus fotos para que elijas las imágenes de tu propiedad."
  add NSPhotoLibraryAddUsageDescription "Habita puede guardar las fotos que tomes de tu propiedad."
  add NSLocationWhenInUseUsageDescription "Habita usa tu ubicación para marcar dónde queda tu propiedad en el mapa."
  /usr/libexec/PlistBuddy -c "Delete :ITSAppUsesNonExemptEncryption" "$PLIST" 2>/dev/null || true
  /usr/libexec/PlistBuddy -c "Add :ITSAppUsesNonExemptEncryption bool false" "$PLIST"
  echo "iOS: permisos agregados a Info.plist"
fi

MANIFEST="android/app/src/main/AndroidManifest.xml"
if [ -f "$MANIFEST" ]; then
  addperm() { grep -q "$1" "$MANIFEST" || sed -i.bak "s#</manifest>#    <uses-permission android:name=\"$1\" />\n</manifest>#" "$MANIFEST"; }
  addperm android.permission.CAMERA
  addperm android.permission.ACCESS_COARSE_LOCATION
  addperm android.permission.ACCESS_FINE_LOCATION
  # Android 11+: permite consultar las apps de mapas instaladas
  grep -q 'android:scheme="geo"' "$MANIFEST" || sed -i.bak 's#</manifest>#    <queries>\n        <intent>\n            <action android:name="android.intent.action.VIEW" />\n            <data android:scheme="geo" />\n        </intent>\n    </queries>\n</manifest>#' "$MANIFEST"
  rm -f "$MANIFEST.bak"
  echo "Android: permisos y consulta de mapas agregados al manifest"
fi
