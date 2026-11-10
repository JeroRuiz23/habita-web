# Habita: app para iOS y Android

La app es una página web (`src/app.html`) empaquetada con Capacitor. Un mismo código genera la app de iPhone y la de Android, con cámara, ubicación y mapas nativos.

## Qué hace con el teléfono

| Función | iPhone | Android |
|---|---|---|
| Botón "Abrir en Apple Maps / Mapas" | Abre Apple Maps con el pin de la vivienda | Abre el mapa predeterminado del teléfono (intent `geo:`) |
| Tomar fotos en la guía de publicación | Cámara nativa | Cámara nativa |
| "Usar mi ubicación actual" | Ubicación del iPhone | Ubicación del teléfono |

## Requisitos

- Node 20 o superior.
- Para iPhone: un Mac con Xcode 16+ y una cuenta de Apple Developer (99 USD al año).
- Para Android: Android Studio y una cuenta de Google Play Console (25 USD, pago único).

## Primera vez

```bash
npm install
npm run build
npx cap add ios        # solo en Mac
npx cap add android
npm run assets         # genera íconos y pantalla de inicio desde /resources
npm run sync           # copia la web y agrega permisos de cámara, ubicación y mapas
```

Después de cada cambio en `src/app.html`: `npm run sync`.

## Probar

```bash
npm run open:ios       # abre Xcode: elige un simulador o tu iPhone y pulsa Run
npm run open:android   # abre Android Studio: elige un emulador o tu teléfono y pulsa Run
```

## Publicar en App Store

1. En Xcode abre `App > Signing & Capabilities`, elige tu Team y deja el Bundle Identifier `co.habita.app` (cámbialo si ya está tomado).
2. En App Store Connect crea una app nueva con ese Bundle ID.
3. En Xcode: `Product > Archive`, luego `Distribute App > App Store Connect`.
4. Sube capturas (iPhone 6,9" y 6,5"), descripción, política de privacidad (URL pública) y completa "App Privacy" (declara cámara, fotos y ubicación aproximada o precisa).
5. Prueba primero con TestFlight y luego envía a revisión.

## Publicar en Google Play

1. En Android Studio: `Build > Generate Signed App Bundle` y elige Android App Bundle (.aab). Crea el keystore y guárdalo en un lugar seguro: sin él no puedes actualizar la app.
2. En Play Console crea la app, sube el .aab a una prueba interna y completa "Seguridad de los datos" y la política de privacidad.
3. Las cuentas personales nuevas deben hacer una prueba cerrada con 12 testers durante 14 días antes de pasar a producción.

## Antes de enviar a revisión

- **Datos reales.** Hoy las viviendas, precios, obras y rentabilidades son de ejemplo. Para publicar necesitas un backend (por ejemplo Supabase o Firebase) donde se guarden usuarios, anuncios y fotos.
- **Apple puede rechazar apps que son solo una página web** (guía 4.2). Esta app usa cámara, ubicación y mapas nativos, y conviene sumar notificaciones push o favoritos con cuenta de usuario antes de enviar.
- **Mapa dentro de la app.** El mapa de la pantalla Explorar es esquemático. Cada vivienda se abre en el mapa del sistema. Para tener un mapa interactivo dentro de la app, el siguiente paso es un plugin con MapKit (iOS) y Google Maps (Android).
- **Asistente con IA.** Hoy interpreta el texto con reglas locales. Para entender cualquier frase se conecta a un modelo de lenguaje desde tu servidor, nunca con la clave dentro de la app.
- **Política de privacidad y términos.** Son obligatorios en ambas tiendas porque la app maneja fotos y ubicación.

## Actualización v3: mapa de Apple, nuevo diseño, tema claro/oscuro

1. Copia sobre tu carpeta `habita-app` las carpetas `src`, `native`, `scripts` y `resources` de este zip (reemplaza). No reemplaces `package.json` ni `ios`.
2. En la terminal, dentro de `habita-app`: `bash scripts/install-native-map.sh`
3. En Xcode: Shift+Cmd+K y Play.

El mapa de Apple (MapKit) se incrusta en la app de iPhone y no necesita llave ni cuenta de pago. En Android y en la vista web se usa un mapa esquemático y el botón abre el mapa del sistema (un mapa incrustado en Android requiere una llave de Google Maps).
Facebook Marketplace no ofrece conexión pública: Habi lee el anuncio que el usuario pega en el chat.

## Versión de la app para Expoandes (v4)

- Navegación: **Explorar · Mi casa · Publicar**. Inversión y Obra gris ya no son secciones: Obra gris es un tipo de vivienda y el análisis financiero vive en *Propiedad → Más información*.
- Buscador con IA: se escribe en lenguaje natural y se convierte en filtros editables (“Esto entendí”).
- Cuestionario inicial de 6 preguntas, editable en *Mi casa → Mi plan*, que alimenta el porcentaje de compatibilidad de cada vivienda.
- Tipos: Apartamento, Casa, Apartaestudio, Habitación (con datos propios) y Obra gris.
- *Mi casa → Mis opciones*: ranking por compatibilidad, revisión de presupuesto, ubicación en el mapa y comparador.
- Demo web de la app: `/app/` (por ejemplo https://jeroruiz23.github.io/habita-web/app/).

## Mejoras de experiencia (v5)

- Primera pantalla de bienvenida (“Encuentra un lugar que realmente se adapte a ti”) → *Empezar* → el mismo cuestionario de 6 preguntas → pantalla “Estamos usando lo que nos dijiste” → resultados personalizados. Se puede saltar con “Prefiero explorar sin responder”.
- *Explorar* abre con el buscador con IA como protagonista (“¿Qué estás buscando?”, ejemplos y explicación corta). El mapa ya no se muestra al inicio: aparece con el botón *Ver mapa* y, en escritorio, después de una búsqueda con IA.
- “Esto entendí” muestra los criterios que Habita leyó (con ✓ y × para quitarlos) y cuántas viviendas encajan.
- Se agregaron dos apartamentos de arriendo cerca de Los Andes para que los ejemplos de búsqueda devuelvan resultados.
