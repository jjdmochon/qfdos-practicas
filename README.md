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

**[`DESIGN.md`](DESIGN.md) es el archivo maestro.** Define color, tipografía,
formas y reglas de móvil; [`src/styles/granada.css`](src/styles/granada.css) es
su traducción literal a tokens CSS. Si un color no encaja se corrige primero en
`DESIGN.md`, nunca dentro de un componente.

El color es el de la casa, no el de la asignatura:

- **Morado académico de Farmacia** (`#5B2B8A`) como ancla: es el color de la
  facultad y el de la muceta que se pondrán al graduarse.
- **Granate de la Universidad de Granada** (`#8C1D2E`) acompañando, y **oro
  nazarí** (`#C08A2E`) como único acento brillante. Verde de la Vega para lo
  correcto, azulejo para lo neutro.
- **Celosía sebka** de la Alhambra en cabecera y portada, **copa de Higía** de
  filigrana y **perfil de Sierra Nevada** cerrando la portada.
- Rótulos en **Cormorant Garamond**, interfaz en **Montserrat**, datos en
  **Roboto Mono**.
- El icono es la granada del escudo, en oro sobre el morado de la facultad.

Los componentes heredados no se modificaron para cambiar de piel: `granada.css`
se carga después del sistema anterior y reescribe sus tokens.

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
- `dev.ps1 -Pages` — compila con base `/qfdos-practicas/` y deja `docs/` listo para
  GitHub Pages (con `.nojekyll` y `404.html`).
- `dev.ps1 -Back` — devuelve a Drive los cambios hechos en la copia local.

Fuera de Drive basta con lo de siempre: `npm install` y `npm run dev`.

### Variables de entorno

Copia `.env.example` a `.env.local`:

- `VITE_GOOGLE_CLIENT_ID` — acceso con cuenta de la UGR. Es el mismo Client ID
  que usa la plataforma QFDOS: las reglas de acceso son idénticas (cuentas
  `@correo.ugr.es`, `@go.ugr.es` y `@ugr.es`; Gmail admitido pero marcado como
  externo; el papel de profesor exige cuenta institucional). Sin él, la
  aplicación funciona igual pero no se puede entregar ni ver el progreso.

  **Esta app corre en otro origen que la principal**, así que en Google Cloud
  Console → *Credentials* → el Client ID → *Authorized JavaScript origins*
  tienen que estar dados de alta:

  ```
  http://localhost:3002
  https://jjdmochon.github.io
  ```

  Si falta el origen, Google responde `origin_mismatch` o `invalid_request` al
  pulsar «Entrar», aunque el Client ID sea correcto.

- `VITE_PRACTICAS_WEBAPP_URL` — URL `/exec` del Apps Script que recibe las
  entregas en una hoja de cálculo. Sin ella se ofrece el envío por correo.

## Publicar en GitHub Pages

1. `.\dev.ps1 -Pages`
2. `git add docs && git commit -m "Publica build" && git push`
3. En GitHub: *Settings* → *Pages* → *Source*: `main` / `docs`

Queda en `https://jjdmochon.github.io/qfdos-practicas/`. Si cambias el nombre del
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
