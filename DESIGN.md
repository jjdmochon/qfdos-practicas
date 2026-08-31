---
version: 4.0
name: Prácticas QFDOS · Identidad Facultad de Farmacia (UGR)
extends: QFDOS Structural Affinity Identity v2.0
description: >
  Archivo maestro de la aplicación de prácticas de Química Farmacéutica II,
  Facultad de Farmacia de la Universidad de Granada, curso 2026/2027.
  Hereda de la identidad QFDOS v2.0 la tipografía, el espaciado, las formas,
  la elevación y el movimiento; sustituye el color, que aquí no es de
  asignatura sino de facultad: el morado académico de Farmacia, anclado en el
  granate de la Universidad de Granada.

  Este documento manda sobre el código. Los tokens de :root en
  src/styles/granada.css son su traducción literal: si un color no encaja, se
  corrige aquí primero y después en el CSS, nunca al revés.

colors:
  # --- Ancla: morado académico de la Facultad de Farmacia ---
  primary: "#5B2B8A"          # Morado de Farmacia
  primary-dark: "#3B1A5E"
  primary-light: "#8257B8"
  primary-bg: "rgba(91, 43, 138, 0.06)"

  # --- Institucional: granate de la Universidad de Granada ---
  secondary: "#8C1D2E"        # Granate UGR (la granada del escudo)
  secondary-dark: "#6A1322"
  secondary-light: "#B3384A"
  secondary-bg: "rgba(140, 29, 46, 0.08)"

  # --- Único acento brillante: oro nazarí ---
  tertiary: "#C08A2E"
  tertiary-light: "#E4BC6B"
  tertiary-dark: "#96691E"

  # --- Superficies: cal del Albaicín con un velo lila ---
  neutral-bg: "#faf7fb"
  surface: "#ffffff"
  surface-raised: "#f4eff8"
  surface-alt: "#eae1f1"

  text-main: "#17111c"
  text-title: "#3B1A5E"
  text-muted: "#5f5468"

  accents:
    vega: "#4E6B3F"           # Verde de la Vega — estado correcto
    amber: "#C08A2E"
    red: "#b91c1c"
    azulejo: "#14607F"        # Alicatado nazarí — información, enlaces químicos
    purple: "#8257B8"

  dark:
    neutral-bg: "#120c18"
    surface: "#1d1526"
    surface-raised: "#271c33"
    surface-alt: "#33253f"
    text-main: "#f4eff8"
    text-title: "#e6d3f5"
    text-muted: "#b3a3bf"
    primary-ink: "#c9a9ee"    # Morado legible sobre superficie oscura
    secondary-ink: "#f0a8b4"
    tertiary: "#E4BC6B"

gradients:
  cabecera: "linear-gradient(135deg, #5B2B8A 0%, #3B1A5E 100%)"
  portada: "linear-gradient(135deg, #5B2B8A 0%, #3B1A5E 55%, #6A1322 100%)"
  seguridad: "linear-gradient(135deg, #3B1A5E 0%, #2b1a2c 50%, #6A1322 100%)"
  progreso: "linear-gradient(90deg, #C08A2E, #5B2B8A)"

typography:
  fontDisplay: "Montserrat, 'Helvetica Neue', Arial, sans-serif"
  fontPrimary: "Montserrat, -apple-system, 'Segoe UI', sans-serif"
  fontTechnical: "'Roboto Mono', 'Fira Code', Consolas, monospace"

shapes:
  radius-sm: "4px"
  radius-md: "8px"
  radius-lg: "12px"
  radius-xl: "16px"
  radius-full: "9999px"

motion:
  binding-snap: "200ms cubic-bezier(0.16, 1, 0.3, 1)"
  hover-lift: "150ms ease-out"

mobile:
  objetivo-tactil: "44px"
  fuente-campos: "16px"       # Por debajo, iOS hace zoom al enfocar
  barra-inferior: "66px"
  safe-area: "env(safe-area-inset-*) en cabecera, barra y pie"
  breakpoint-movil: "780px"
---

# Identidad de las Prácticas · Facultad de Farmacia, UGR

Archivo maestro de la aplicación. Hereda de la identidad QFDOS v2.0 todo lo
que no es color; el color se reasigna porque esta aplicación no representa a
una asignatura, sino al sitio donde se hacen las prácticas: la Facultad de
Farmacia de la Universidad de Granada.

---

## 1. De dónde sale el color

| Token | Color | Procedencia |
| --- | --- | --- |
| `--primary` | Morado `#5B2B8A` | Color académico de Farmacia. Es la muceta que se pondrán los estudiantes al graduarse; a un paso de terminar el grado, es el color que les identifica. |
| `--secondary` | Granate `#8C1D2E` | Color institucional de la Universidad de Granada y de la granada de su escudo. Ancla la facultad en su universidad. |
| `--tertiary` | Oro `#C08A2E` | Yeserías y artesonados nazaríes. Único acento brillante: se reserva para lo que hay que mirar. |
| `--accent-vega` | Verde `#4E6B3F` | Los olivares de la Vega. Estado correcto, comprobado, entregado. |
| `--accent-azulejo` | Azul `#14607F` | Alicatado de zócalo. Información neutra y estructuras químicas. |

Regla de reparto: **el morado manda, el granate acompaña, el oro señala**. Si
en una pantalla compiten los tres a la vez, sobra uno.

## 2. Elementos de Granada

No son adorno suelto: sitúan la aplicación en su ciudad y en su facultad.

* **Celosía sebka.** La retícula romboidal de la Alhambra, en la cabecera y en
  la portada, al 14 % de opacidad. Es textura, nunca protagonista.
* **Perfil de Sierra Nevada.** Cierra la portada por abajo: el horizonte que se
  ve desde el Campus de Cartuja.
* **La granada.** Fruto del escudo de la ciudad y de la Universidad. Es el
  icono de la aplicación: granada abierta en oro sobre morado de Farmacia.
* **Copa de Higía.** El símbolo de la profesión farmacéutica —copa y
  serpiente— como filigrana de la portada, al 10 %.

Lo que **no** entra: motivos religiosos, lemas de época y cualquier cita
devocional. La identidad es universitaria y profesional.

## 3. Tipografía

* **Montserrat** — todo: rótulos, titulares e interfaz. Es la misma familia que
  la plataforma del curso, y esa continuidad es deliberada: al pasar del
  temario a las prácticas no cambia la voz, solo el color. Los titulares se
  distinguen por peso (800–900) y tracking negativo (−0.015 a −0.025 em), no
  por familia. Nada de serif: el rótulo antiguo alejaba las prácticas del resto
  de la asignatura.
* **Roboto Mono** — masas, moles, rendimientos, desplazamientos químicos.
  Cualquier cifra que se compare en columna va en monoespaciada y con
  `font-variant-numeric: tabular-nums`.

## 4. Móvil primero

La aplicación se usa de pie, con guantes puestos y con una mano ocupada:

* Barra inferior con los cuatro destinos más frecuentes al alcance del pulgar.
* Objetivos táctiles de **44 px** como mínimo.
* Campos de formulario a **16 px**: por debajo, iOS amplía el zoom al enfocar
  y descoloca la página.
* `env(safe-area-inset-*)` en cabecera, barra inferior y pie, para el *notch* y
  la barra de gestos.
* Un elemento flexible no baja de su tamaño mínimo automático; en pantalla
  pequeña ese mínimo se anula, o las tarjetas heredadas del aula salen
  cortadas por la derecha.

## 5. Modo oscuro

No es gris: es morado apagado. El fondo `#120c18` y sus superficies mantienen
el tono entre 275 y 285, y los bordes son oro con alfa. El texto sube a
`#f4eff8` y los rótulos a `#e6d3f5`.

## 6. Cómo se aplica

`src/styles/granada.css` se carga después del sistema heredado (`index.css` y
`App.css`) y reescribe sus tokens. Los componentes del módulo no se modifican
para cambiar de piel: si hay que retocar un color, se retoca aquí y en este
documento, no dentro de un componente.
