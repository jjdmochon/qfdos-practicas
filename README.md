# Prácticas de Química Farmacéutica II · v4

Cuaderno de prácticas de laboratorio para el alumnado de último curso del Grado
en Farmacia de la **Universidad de Granada**. Aplicación independiente, pensada
para usarse con el móvil en la mano dentro del laboratorio y para instalarse
como app en iOS y Android.

Nace del módulo de prácticas de la plataforma QFDOS v3 y funciona por su cuenta:
no necesita el resto del curso para nada.

---

## Qué incluye

| Apartado | Para qué sirve |
| --- | --- |
| **0 · Seguridad** | Las 16 normas oficiales, los riesgos de cada reactivo y la firma del compromiso. Hasta firmarlo, el resto está bloqueado. |
| **1 · Protocolos** | Síntesis de Propranolol (etapas I y II) y de la DHPP paso a paso, con los esquemas de reacción. |
| **2 · Rendimientos** | Reactivo limitante, moles, rendimiento teórico y real; cuaderno de la práctica. |
| **3 · Disoluciones** | Preparación a partir de sólidos y de ácidos comerciales, y diluciones V₁M₁ = V₂M₂. |
| **4 · Espectroscopia** | Visor de espectros reales ¹H, ¹³C, DEPT-135 y HR-MS con asignación de señales. |
| **5 · Material** | Puesto de trabajo, montajes y operaciones básicas. |
| **6 · Examen** | Simulacro con estructuras y pesos moleculares. |
| **7 · Cuaderno por parejas** | Informe conjunto, entrega al profesor y panel de recepción. |

Además: «Mi progreso» (qué has entregado y qué te falta) y exportación de tu
semana de laboratorio al calendario del móvil en formato `.ics`.

## Móvil: iOS y Android

- **Instalable.** Manifiesto propio, iconos PNG (incluido `apple-touch-icon`,
  que iOS exige en PNG) y arranque a pantalla completa.
  - iOS/Safari: *Compartir* → *Añadir a pantalla de inicio*.
  - Android/Chrome: *Instalar aplicación*.
- **Funciona sin cobertura.** Un *service worker* guarda la aplicación y los
  esquemas ya visitados; el sótano del laboratorio no tiene señal.
- **Diseño táctil.** Barra inferior a distancia del pulgar, pestañas
  deslizables, botones de 44 px mínimo y tipografía de 16 px en los campos
  (por debajo, iOS hace zoom al enfocar).
- **Respeta el «notch»** y la barra de gestos mediante `safe-area-inset`.
- Modo claro y oscuro, siguiendo el sistema y con conmutador propio.

## Identidad visual

La piel de la aplicación es Granada, no un tema genérico:

- **Granate** de la granada del escudo de la ciudad y de la Universidad, con
  **oro nazarí** como único acento brillante, **azulejo** de alicatado y verde
  de la Vega.
- **Celosía sebka** de la Alhambra tejida en la cabecera y en la portada.
- **Perfil de Sierra Nevada** cerrando la portada: el horizonte que se ve desde
  la Facultad.
- Rótulos en **Cormorant Garamond**, interfaz en **Montserrat** y datos en
  **Roboto Mono**.
- El icono de la app es una granada abierta en oro sobre granate.

El fichero [`src/styles/granada.css`](src/styles/granada.css) reescribe los
tokens heredados de QFDOS; los componentes no se tocaron para cambiar de piel.

## Poner en marcha

El código vive en Google Drive, cuyo sistema de ficheros virtual no soporta
`npm install` (falla con `TAR_ENTRY_ERROR` y deja `node_modules` a medias). El
script `dev.ps1` resuelve eso: guarda las dependencias y ejecuta el servidor en
el disco local, sincronizando el código.

```powershell
.\dev.ps1
```

```powershell
.\dev.ps1 -Build
```

```powershell
.\dev.ps1 -Pages
```

- `dev.ps1` — servidor de desarrollo en <http://localhost:3002>. Imprime también
  una dirección de red: ábrela en el móvil conectado al mismo Wi-Fi para probar
  en el dispositivo real.
- `dev.ps1 -Build` — comprueba tipos y compila.
- `dev.ps1 -Pages` — compila con base `/practicas/` y deja `docs/` listo para
  GitHub Pages (con `.nojekyll` y `404.html`).
- `dev.ps1 -Back` — devuelve a Drive los cambios hechos en la copia local.

Fuera de Drive basta con lo de siempre: `npm install` y `npm run dev`.

### Variables de entorno

Copia `.env.example` a `.env.local`:

- `VITE_GOOGLE_CLIENT_ID` — acceso con cuenta de la UGR. Sin él la aplicación
  funciona igual, pero no se puede entregar ni ver el progreso.
- `VITE_PRACTICAS_WEBAPP_URL` — URL `/exec` del Apps Script que recibe las
  entregas en una hoja de cálculo. Sin ella se ofrece el envío por correo.

## Publicar en GitHub Pages

1. `.\dev.ps1 -Pages`
2. `git add docs && git commit -m "Publica build" && git push`
3. En GitHub: *Settings* → *Pages* → *Source*: `main` / `docs`

Queda en `https://jjdmochon.github.io/practicas/`. Si cambias el nombre del
repositorio, actualiza `PAGES_BASE` en `dev.ps1`: con una base equivocada la
página sale en blanco sin ningún error a la vista.

## Iconos

Se generan sin dependencias, rasterizando la granada con campos de distancia:

```bash
node scripts/generar-iconos.mjs
```

## Dónde se guardan los datos

Lo que se escribe en el cuaderno vive en el `localStorage` del propio
dispositivo. Solo sale de ahí cuando el estudiante pulsa «entregar»: entonces
viaja al Apps Script del profesor. No hay analítica ni terceros.

---

Universidad de Granada · Facultad de Farmacia · Dpto. de Química Farmacéutica y
Orgánica · Química Farmacéutica II, Grupo E.
