---
name: Consumer Health Companion Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#4648d4'
  on-tertiary: '#ffffff'
  tertiary-container: '#6063ee'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies a friendly, approachable consumer health companion. The personality is warm, reassuring, and deeply empathetic, tailored entirely for everyday users rather than clinical professionals. The emotional response is one of calm, safety, and encouragement.

We utilize a modern, human-centric design style characterized by generous whitespace, soft luminous surfaces, welcoming typography, and an approachable color palette that transforms mundane health tracking into a comforting daily ritual.

## Colors

The color palette is anchored by a reassuring deep teal primary and a vibrant mint secondary, evoking cleanliness, growth, and wellness. A friendly indigo accent brings warmth to interactive elements and calls to action. Neutrals are soft and warm, moving away from harsh clinical whites to create an inviting, low-stress environment.

- **Primary (`#0D9488`):** Used for primary actions, critical headers, and key brand moments.
- **Secondary (`#14B8A6`):** Applied to supportive badges, active states, and secondary interactive components.
- **Tertiary (`#6366F1`):** Serves as a friendly focal accent for delightful highlights and notifications.
- **Neutral (`#F8FAFC`):** Provides an expansive, clean background canvas that reduces eye strain.

## Typography

Typography prioritizes supreme legibility and emotional warmth. Using a single geometric yet soft typeface family ensures high readability across all age groups and devices. 

- Headings feature friendly proportions with tight letter-spacing for a modern, approachable feel.
- Body sizes are generous (never dropping below 14px for primary content) to ensure effortless reading for everyday users.
- Line heights are deliberately spacious to reduce cognitive load and enhance the calming rhythm of the interface.

## Layout & Spacing

We employ a fluid grid layout that adapts gracefully across devices, ensuring generous margins and breathing room. The spacing rhythm relies on a generous scale (`space-xs` through `space-xl`) that prevents the UI from feeling cramped or clinical.

- **Mobile:** 16px outer margins with single-column stacked card layouts.
- **Tablet & Desktop:** Content centers within a comfortable reading width, utilizing 24px to 40px gutters to separate content islands cleanly without visual clutter.

## Elevation & Depth

Visual hierarchy is conveyed through ambient, low-opacity shadows paired with soft tonal layers. Depth should feel gentle and floating rather than stark. 

- Use diffused, low-opacity shadows tinted with subtle teal undertones to create a warm, uplifting appearance.
- Surface containers step up from the base background using light elevation tiers, avoiding heavy borders in favor of soft, luminous separation.

## Shapes

The shape language is consistently rounded and friendly (Level 2). Sharp corners are entirely avoided to maintain a welcoming, non-threatening aesthetic.

- Base UI elements (buttons, inputs) use `0.5rem` border radius.
- Larger containers and cards use `1rem` to `1.5rem` radii (`rounded-lg` and `rounded-xl`), creating soft, pillows of information that invite touch and interaction.

## Components

Components are designed to be tactile, forgiving, and clear.

- **Buttons:** Large, thumb-friendly touch targets with fully rounded or generously curved corners (`0.5rem`). Primary buttons use the deep teal fill with high-contrast text, while secondary actions use soft mint or subtle ghost variants.
- **Cards:** Spacious content containers featuring white or light tinted surfaces, soft ambient shadows, and generous internal padding (`space-lg`). Ideal for grouping daily metrics, health insights, and reminders.
- **Input Fields:** Friendly text inputs with generous height, soft borders, and clear placeholder text in neutral tones. Focus states transition smoothly to the primary teal with a subtle glowing ring.
- **Checkboxes & Radio Buttons:** Oversized, friendly selection controls with smooth micro-animations on check.
- **Chips:** Pill-shaped tags used for filtering symptoms or quick status selections, featuring soft background fills and clear, high-contrast labels.
- **Lists:** Clean, vertically stacked list items separated by generous whitespace rather than harsh dividers, featuring leading icons housed in soft secondary color containers.