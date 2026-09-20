---
name: La Costeña Centro de Control Financiero
description: Dashboard ejecutivo de inteligencia de mercado y finanzas, estética Apple
colors:
  signal-blue: "#0071E3"
  signal-blue-soft: "#E8F1FD"
  signal-blue-deep: "#0058B0"
  confirmed-green: "#1D8A45"
  confirmed-green-soft: "#E7F6EC"
  attention-amber: "#B5680A"
  attention-amber-soft: "#FCF1DF"
  alert-red: "#D6362A"
  alert-red-soft: "#FBEAE9"
  fog-bg: "#F5F5F7"
  surface: "#FFFFFF"
  surface-sunken: "#E8E8ED"
  ink: "#1D1D1F"
  ink-secondary: "#6E6E73"
  ink-tertiary: "#86868B"
  hairline: "rgba(0,0,0,.08)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(23px, 2vw, 32px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  kpi-value:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "30px"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.06em"
rounded:
  sm: "14px"
  md: "20px"
  lg: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "28px"
  "2xl": "36px"
components:
  kpi-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "#FFFFFF"
    rounded: "11px"
    padding: "11px 16px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-deep}"
  nav-item-active:
    backgroundColor: "{colors.signal-blue-soft}"
    textColor: "{colors.signal-blue-deep}"
    rounded: "12px"
---

# Design System: La Costeña Centro de Control Financiero

## Overview

**Creative North Star: "The Quiet Control Room"**

Este es un instrumento de decisión financiera, no una vitrina. El sistema se inspira directamente en el lenguaje visual de Apple (System Preferences, Stocks, Health): superficies planas, un único acento de color con autoridad, tipografía del sistema, y cero decoración que compita con el número que el director financiero necesita leer en dos segundos. Nació como el rediseño completo de un dashboard genérico (gradientes ámbar/verde, tarjetas con barras de acento arcoíris, listbox nativos del navegador) hacia un sistema unificado de un solo azul de sistema y grises neutros.

Rechazos visuales confirmados durante el rediseño: gradientes multicolor por tarjeta (ámbar → índigo → verde → púrpura), barras de acento de 3px en la parte superior de las tarjetas, sombras duras con tinte de color, listbox nativos del sistema operativo para los selects, texto en beige/café cálido para ejes de gráficas.

**Key Characteristics:**
- Un solo acento de color (azul de sistema); todo lo demás es escala de grises.
- Tarjetas planas sin bordes de color ni barras decorativas — la jerarquía viene del tamaño tipográfico, no del color.
- Componentes de selección (`<select>`) nunca usan el picker nativo del navegador; siempre un panel propio con estilo del sistema.
- Modo oscuro es un ciudadano de primera clase, no un afterthought: fondo `#000000` puro con superficies `#1C1C1E`.

## Colors

Un acento (azul), tres semánticos (verde/ámbar/rojo) y una escala de grises neutros. Nunca se mezclan dos acentos "decorativos" en la misma pantalla.

### Primary
- **Signal Blue** (#0071E3 claro / #0A84FF oscuro): único color de marca/interacción. Botones primarios, filtro activo, pill de navegación activa, líneas de tendencia "año actual" en gráficas.

### Secondary (semánticos de estado, no decorativos)
- **Confirmed Green** (#1D8A45 / #30D158 oscuro): variación favorable, margen saludable, KPI positivo.
- **Attention Amber** (#B5680A / #FF9F0A oscuro): estados pendientes/de simulación, badges "no investigado".
- **Alert Red** (#D6362A / #FF453A oscuro): variación desfavorable, alertas de margen negativo.

### Neutral
- **Fog** (#F5F5F7 / #000000 oscuro): fondo de la aplicación.
- **Surface** (#FFFFFF / #1C1C1E oscuro): tarjetas, paneles, topbar.
- **Ink** (#1D1D1F / #F5F5F7 oscuro): texto primario.
- **Ink Secondary** (#6E6E73 / #AEAEB2 oscuro): texto de apoyo, subtítulos.
- **Ink Tertiary** (#86868B / #8E8E93 oscuro): metadatos, placeholders, ejes de gráfica.
- **Hairline** (rgba(0,0,0,.08) / rgba(255,255,255,.10) oscuro): todos los bordes del sistema.

### Named Rules
**The One Accent Rule.** Signal Blue es el único color usado para "esto es interactivo/importante". Verde/ámbar/rojo comunican estado del dato, nunca marca ni interacción genérica.
**The No Rainbow Cards Rule.** Ninguna tarjeta lleva una barra o borde de color decorativo por tipo de métrica. El color vive solo en el ícono pequeño de la esquina, nunca en el borde ni el fondo completo de la tarjeta.

## Typography

**Display Font:** -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif (sin fuentes web externas — cero dependencia de red, carga instantánea).

**Character:** pila nativa del sistema operativo del usuario; en Mac se ve como SF Pro real, en Windows cae a Segoe UI. Nunca Inter.

### Hierarchy
- **Display / Título de vista** (600, `clamp(23px,2vw,32px)`, 1.15): título de cada una de las 7 vistas (`#topbar h1`).
- **KPI Value** (650, 30px, 1.15, -0.015em): el número principal de cada tarjeta ejecutiva.
- **Body** (400-600, 12.5-14px, 1.5): texto de párrafo, celdas de tabla, subtítulos de panel.
- **Label** (700, 10.5-11px, uppercase, 0.06-0.09em tracking): eyebrows de KPI, encabezados de tabla, etiquetas de grupo de navegación.

### Named Rules
**The System-Only Rule.** Ninguna fuente se carga por red (`@font-face` o Google Fonts). El archivo es 100% autocontenido; la tipografía siempre resuelve a la pila nativa del SO.

## Layout

Layout de aplicación de escritorio: sidebar fija (264px, colapsable a 76px con solo íconos) + topbar sticky + área de contenido con scroll propio (`#content{overflow-y:auto}`), no scroll de página completa. Grid de 4 columnas para KPIs (`repeat(4,1fr)`, gap 20px), colapsa a 2 columnas en `≤1200px` y 1 columna en `≤640px`. Paneles de contenido en `grid2`/`grid3` (1.3fr/1fr o tercios) colapsan a una sola columna en `≤1400px`.

Responsive real (no solo "se encoge"): en `≤900px` el sidebar se vuelve rail de solo-íconos; en `≤560px` la barra de estado del topbar envuelve a una segunda línea y el buscador trunca con elipsis en vez de desbordar; las tablas anchas (12 columnas en la Matriz de mercado) obtienen scroll horizontal propio dentro de su tarjeta en vez de romper el ancho de la página.

## Elevation & Depth

**The Flat-by-Default Rule.** El sistema es mayormente plano: las tarjetas usan un borde de 1px (`hairline`) como separación primaria, no sombra. La sombra (`0 1px 2px rgba(0,0,0,.04), 0 10px 22px -16px rgba(0,0,0,.14)`) es sutil y ambiental, reservada para paneles flotantes reales (drawer de detalle, modal de pantalla completa, panel de select) donde sí hay una superficie físicamente elevada sobre el contenido.

### Shadow Vocabulary
- **shadow** (`0 1px 2px rgba(0,0,0,.04), 0 10px 22px -16px rgba(0,0,0,.14)`): paneles de contenido en reposo.
- **shadow-hover** (`0 4px 10px rgba(0,0,0,.05), 0 22px 44px -20px rgba(0,0,0,.18)`): hover de panel/tarjeta.
- **shadow-hero** (`0 2px 6px rgba(0,0,0,.04), 0 30px 64px -30px rgba(0,0,0,.16)`): tarjetas hero de Inteligencia de Mercado.

## Shapes

Escala de radio consistente en toda la app: `sm` 14px (inputs, badges pequeños), `md` 20px (tarjetas y paneles principales), `lg` 28px (tarjetas hero). Botones e íconos circulares usan radio `pill` (999px). Sin mezclar escalas: un botón nunca es cuadrado en un layout de esquinas suaves.

## Components

### Buttons
- **Shape:** radio 11px (CTA de drawer) o pill completo (chips de filtro, badges).
- **Primary:** fondo Signal Blue, texto blanco, padding `11px 16px`.
- **Hover:** fondo Signal Blue Deep, `translateY(-1px)`.
- **Secondary/Ghost:** fondo `sunken`, texto `ink`, borde `hairline`.

### KPI Cards
- **Corner Style:** 20px.
- **Background:** `surface` plano, sin gradiente.
- **Shadow Strategy:** ninguna en reposo; `shadow-hover` sutil + `translateY(-2px)` al hover.
- **Border:** 1px `hairline`; el color solo aparece en el chip de ícono de 32px en la esquina superior derecha, nunca en el borde completo de la tarjeta.
- **Internal Padding:** 24px.

### Custom Select Panel (componente de firma)
El `<select>` nativo del navegador nunca se muestra: al hacer click, un panel propio (`.fselect-panel`) se dibuja con fondo `surface`, borde `hairline`, radio 14px, sombra flotante, filas con hover `sunken` y check de Signal Blue en el elemento seleccionado. El `<select>` original sigue existiendo (oculto) para no romper la lógica de filtros existente — el panel solo reenvía el valor elegido como evento `change` nativo.

### Sidebar / Navigation
- **Style:** fondo plano (gradiente casi imperceptible `#fbfbfd → #f2f2f5`), sin bordes de color.
- **Item activo:** pill de fondo Signal Blue Soft detrás del ítem (se desliza con transform), texto en Signal Blue Deep. Sin barra lateral de acento (eliminada en el rediseño — se sentía genérica).
- **Item hover:** fondo `sunken`, sin desplazamiento horizontal.

### Boot Splash (componente de firma)
Pantalla de arranque de ~1.5s con anillos giratorios y barra de progreso, 100% en la familia Signal Blue / Índigo (`#0A84FF → #5E5CE6`) sobre negro puro — coherente con el resto del sistema desde el primer frame, nunca el ámbar/verde de marca heredado.

## Do's and Don'ts

### Do:
- **Do** usar Signal Blue como único acento interactivo en toda la app (botones, filtros activos, pill de nav, líneas "año actual" en gráficas).
- **Do** usar el panel de select propio para cualquier `<select>` nuevo, nunca el picker nativo del navegador.
- **Do** mantener el tema oscuro probado en cada cambio visual — `#000000` puro de fondo, `#1C1C1E` de superficie.
- **Do** usar iconos SVG inline de trazo simple (stroke-width 1.7-2), nunca íconos de librería con relleno pesado.

### Don't:
- **Don't** agregar una segunda barra o borde de color decorativo a las tarjetas KPI — el color vive solo en el chip de ícono.
- **Don't** usar gradientes multicolor (índigo-a-verde, ámbar-a-teal) en gráficas o UI; los gradientes solo son de un color a su propia variante más oscura (ej. Signal Blue → Signal Blue Deep).
- **Don't** cargar fuentes por red (`<link>` a Google Fonts o `@font-face` remoto) — rompe la autocontención del archivo.
- **Don't** dejar que un `<select>` abra su listbox nativo del sistema operativo.
