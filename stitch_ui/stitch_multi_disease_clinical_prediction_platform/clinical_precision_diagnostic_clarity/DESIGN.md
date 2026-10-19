---
name: Clinical Precision & Diagnostic Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3e4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#0047bf'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e5fe7'
  on-tertiary-container: '#e6e9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-numeric-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  label-numeric-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-numeric-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: '0'
  label-status:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system delivers an authoritative, high-efficiency interface tailored for clinical practitioners, epidemiologists, and acute care teams operating under high cognitive load. The design philosophy fuses the rigorous informational density of enterprise EHR systems (such as Epic and Cerner) with modern diagnostic clarity and low-latency interaction patterns.

The visual style is **Corporate / Modern Clinical**:
- **Clarity over ornament:** Decorative assets, playful visual noise, and arbitrary decorative curves are eliminated. Every visual token conveys status, diagnostic hierarchy, or actionability.
- **Cognitive stabilization:** High-contrast text hierarchies ensure critical patient data, risk scores, and trend deltas are immediately decipherable in high-glare clinical workstation environments.
- **Calibrated urgency:** Semantic alerts are strictly gated. Vivid saturated signals are reserved for triage vectors (low, moderate, high risk), while the supporting interface recedes into sterile, low-strain neutral tones.

## Colors

The palette establishes an ergonomic hierarchy that minimizes eye fatigue during extended clinical shifts while maintaining strict WCAG AAA compliance for critical data points.

### Palette Architecture
- **Canvas & Structural Neutrals:**
  - `Surface Canvas`: `#f8fafc` (Slate 50) establishes a sterile, cool-gray work area.
  - `Card / Surface Raised`: `#ffffff` (Pure White) defines interactive cards and data surfaces.
  - `Structural Border`: `#e2e8f0` (Slate 200) defines boundaries and table dividers.
  - `Border Subtle`: `#f1f5f9` (Slate 100) provides inner structural cell dividers.
  - `Text Primary`: `#0f172a` (Slate 900) for clinical values, primary headers, and critical patient metrics.
  - `Text Muted / Secondary`: `#64748b` (Slate 500) for metadata, units of measurement, timestamps, and axis labels.

- **Primary Diagnostic Accents:**
  - `Primary (Clinical Deep Teal)`: `#0f766e` (Teal 700) for primary command actions, selected assessment tabs, and active diagnostic modes.
  - `Secondary (Clinical Sky / Ocean)`: `#0284c7` (Sky 600) for deep-link diagnostics, filter indicators, and interactive links.
  - `Tertiary (Clinical Indigo)`: `#2563eb` (Blue 600) for patient record synchronization, secondary system workflows, and ancillary flags.

- **Semantic Risk & Status Tiers (Strict Enforcement):**
  - **Low Risk / Protective Factors:** `#059669` (Emerald 600) text/icon, `#d1fae5` (Emerald 100) surface, `#10b981` (Emerald 500) indicator badge.
  - **Moderate / Borderline Risk:** `#d97706` (Amber 600) text/icon, `#fef3c7` (Amber 100) surface, `#f59e0b` (Amber 500) indicator badge.
  - **High Risk / Critical Elevating Factors:** `#dc2626` (Crimson 600) text/icon, `#fee2e2` (Crimson 100) surface, `#ef4444` (Crimson 500) indicator badge.
  - **Informational / Baseline:** `#0284c7` (Sky 600) text/icon, `#e0f2fe` (Sky 100) surface.

## Typography

The typographical foundation optimizes scan-efficiency and numeric precision.

- **Primary Proportional Typeface (Inter):** Applied across headers, body content, labels, and status summaries. Open apertures and tall x-height deliver maximum legibility on standard, non-retina medical monitors.
- **Diagnostic Numeric Typeface (JetBrains Mono):** Dedicated to lab values, biomarker metrics, percentiles, blood pressure readings, and risk probabilities. Tabular alignment ensures that stacked vertical comparisons across patient encounters do not introduce horizontal visual drift.
- **Typographic Rules:**
  - Status badges enforce uppercase rendering (`text-transform: uppercase`) paired with `letterSpacing: 0.04em` to guarantee distinction from general body text.
  - Units of measurement (e.g., `mg/dL`, `mmol/L`, `bpm`) must always be formatted in `body-sm` using the muted neutral color `#64748b` positioned immediately adjacent to the numerical value.

## Layout & Spacing

The dashboard employs a dense, structured **12-column fluid grid** system optimized for multi-parameter clinical views without requiring excessive scrolling.

### Breakpoints & Reflow Behavior
- **Desktop (>= 1280px):** 12-column layout. Standard margin `1.5rem`, column gutter `1rem`. Accommodates a persistent 280px patient demographic and encounter rail alongside a multi-disease risk matrix and interactive telemetry tables.
- **Tablet (768px – 1279px):** 8-column layout. Margin `1rem`, gutter `1rem`. Patient sidebar collapses into an expandable horizontal summary banner; multi-disease cards reflow from 3 across to 2 across.
- **Mobile (< 768px):** 4-column layout. Margin `0.75rem`, gutter `0.75rem`. Cards become single-column full-width stacks; tabular patient data transforms into horizontally swipeable lists with pinned metric identifiers.

### Spacing Rhythm
- Density is prioritized: internal card paddings scale strictly between `0.75rem` (`space-md`) and `1.25rem` (`space-lg`) to balance information density with clean operational parsing.
- Gaps between independent diagnostic widgets are strictly maintained at `1rem` to enforce visual separation without fragmenting workflow context.

## Elevation & Depth

To avoid visual distortion and ambient clutter on workstation screens, depth is established through **low-contrast outlines combined with ultra-diffused, micro-ambient shadows**:

- **Surface Baseline (Level 0):** Background canvas `#f8fafc`. Completely flat, non-elevated.
- **Card Surface (Level 1):** Pure white `#ffffff` cards surrounded by a single crisp `1px` border of `#e2e8f0` and an ultra-subtle ambient shadow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Card Surface Elevated / Dropdown (Level 2):** Flyouts, contextual lab panels, and active tooltips maintain a `1px` border of `#cbd5e1` with depth: `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Modal Dialogues / Urgent Alerts (Level 3):** Override dialogs and confirmation drawers use: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`, backed by a `backdrop-blur(2px)` overlay of `rgba(15, 23, 42, 0.4)`.

## Shapes

The design system adopts a **Soft (Level 1)** geometric standard. This geometry produces a disciplined, functional clinical appearance that avoids the stark severity of raw 90-degree corners while preventing the excessive, playful softness of rounded consumer apps.

- **Standard Cards, Panels, & Inputs:** Use `rounded` (0.25rem / 4px) to `rounded-lg` (0.5rem / 8px).
- **Risk Indicators & Semantic Badges:** Use a true pill radius (`rounded-full` / 9999px). The high curvature on badges isolates them as discrete diagnostic tags separate from rectangular data containers.
- **Buttons & Form Fields:** Strictly use `rounded` (0.375rem / 6px) to maintain a reliable, tactile target boundary.

## Components

### 1. Risk Status Badges (Pill Badges)
- **Geometry:** Height of 22px, padding of 2px 8px, border-radius 9999px.
- **Variants:**
  - **Low Risk / Protective:** Background `#ecfdf5`, border `1px solid #a7f3d0`, text `#065f46`, leading circular dot indicator `#059669` (6px diameter).
  - **Moderate Risk:** Background `#fffbeb`, border `1px solid #fde68a`, text `#92400e`, leading circular dot indicator `#d97706` (6px diameter).
  - **High Risk / Elevating:** Background `#fef2f2`, border `1px solid #fecaca`, text `#991b1b`, leading circular dot indicator `#dc2626` (6px diameter).
- **Typography:** Uses `label-status` (Inter 11px, bold, uppercase, tracked).

### 2. Clinical Data Tables
- **Container:** Pure white card surface, `1px solid #e2e8f0` outer wrapper.
- **Header Cells:** Background `#f8fafc`, text `#475569`, typography `label-numeric-sm` (uppercase, weight 600), height 36px, horizontal padding 12px, border-bottom `1px solid #cbd5e1`.
- **Data Rows:** Alternating row highlights disabled. Row height 40px, cell padding 12px. Border-bottom `1px solid #f1f5f9`. Row hover state `#f8fafc`.
- **Cell Alignment:** Categorical/textual data left-aligned; all clinical readings, percentages, and lab markers right-aligned using `label-numeric-md` in JetBrains Mono.

### 3. Metric & Diagnostic Cards
- **Structure:** White card background `#ffffff`, `1px solid #e2e8f0`, border-radius 8px, padding `1rem`.
- **Header Row:** Flexbox row containing category title (`body-sm`, bold, `#64748b`) and right-aligned risk status pill.
- **Primary Value:** Displayed using `label-numeric-lg` (`#0f172a`), followed immediately by trend icon (e.g., arrow up/down) colored by semantic risk direction.
- **Footer Section:** Border-top `1px solid #f1f5f9`, margin-top `0.5rem`, padding-top `0.5rem`. Contains normal reference range string (`body-sm`, `#64748b`).

### 4. Interactive Buttons
- **Primary:** Background `#0f766e`, text `#ffffff`, hover `#115e59`, active `#134e4a`. Height 36px, radius 6px, padding 0 14px.
- **Secondary:** Background `#ffffff`, border `1px solid #cbd5e1`, text `#0f172a`, hover `#f8fafc`.
- **Destructive / Clinical Alert Action:** Background `#dc2626`, text `#ffffff`, hover `#b91c1c`.

### 5. Form Fields & Parameter Sliders
- **Text / Number Inputs:** Height 36px, background `#ffffff`, border `1px solid #cbd5e1`, radius 6px, horizontal padding 10px. Active focus ring: `2px solid #0f766e` with an offset of 1px.
- **Risk Score Sliders:** Track height 6px, track background `#e2e8f0`, fill colored dynamically according to threshold zone (green to amber to red). Thumb diameter 16px, solid white with `2px solid #0f766e`.

### 6. Multi-Disease Risk Matrix Strip
- High-density comparative bar embedded in card headers. Segmented risk progression bar (4px height) divided into calibrated clinical stages, visually filled with corresponding semantic colors to visualize multi-condition co-morbidity thresholds at a glance.