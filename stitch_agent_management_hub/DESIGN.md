---
name: Modern Technical Aesthetic
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#c6c6c6'
  on-secondary: '#303030'
  secondary-container: '#474747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Sora
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  sidebar-width: 280px
  grid-gutter: 24px
  grid-margin: 32px
---

## Brand & Style

This design system is engineered for high-performance technical environments, blending a "Dark Mode First" philosophy with precision-grade aesthetics. The personality is disciplined, futuristic, and sophisticated. It targets developers, data scientists, and engineers who require a low-fatigue environment for deep work. 

The visual style is a hybrid of **Minimalism** and **Glassmorphism**, utilizing a "Pure Black" foundation to maximize OLED contrast while employing subtle tonal layering and indigo accents to guide user attention. The result is a UI that feels like a high-end command center—utilitarian yet premium.

## Colors

The palette is anchored by a pure black (`#000000`) background to create an infinite depth effect. Contrast is managed through a "lifting" logic: as elements rise in the information hierarchy, their surface color becomes slightly lighter and their border more pronounced.

The **Indigo Accent** (`#6366f1`) is used sparingly for primary actions, focus states, and progress indicators. It provides a vibrant contrast against the dark surfaces, ensuring critical paths are immediately identifiable. Status colors (Success, Warning, Error) follow standard technical conventions but are desaturated to maintain harmony with the indigo primary.

## Typography

The design system exclusively uses **Sora** for all interface levels to maintain a cohesive, technical, and geometric appearance. The font's wide character set and distinct apertures provide excellent legibility on high-resolution screens. 

For technical data or code snippets, **JetBrains Mono** is utilized to provide a clear distinction from narrative or instructional text. High-level headers use tighter letter spacing and heavier weights to project authority, while body text uses a generous line height to ensure readability against the high-contrast black background.

## Layout & Spacing

The layout follows a 12-column fluid grid for the main content area, while the **Sidebar** remains at a fixed width of 280px for consistent navigation. Spacing is strictly based on a 4px baseline grid to ensure mathematical alignment across all components.

**Mobile (up to 768px):** The sidebar collapses into a bottom navigation bar or a hamburger menu. Margins reduce to 16px.
**Tablet (769px to 1024px):** The sidebar can be minimized to an icon-only rail.
**Desktop (1025px+):** The full sidebar is persistent. Content is centered with a maximum width of 1440px to prevent excessive line lengths.

## Elevation & Depth

Against the `#000000` background, traditional shadows are ineffective. Instead, depth is communicated through **Tonal Layering** and **Luminous Outlines**:

1.  **Level 0 (Background):** Pure `#000000`.
2.  **Level 1 (Main UI Containers):** Surface-low (`#0a0a0a`) with a subtle 1px border of `rgba(255, 255, 255, 0.08)`.
3.  **Level 2 (Modals/Popovers):** Surface-medium (`#121212`) with a more prominent border and a very soft, large-radius glow (10% Indigo opacity) to simulate light spill.
4.  **Glassmorphism:** Use `backdrop-filter: blur(12px)` for navigation bars and sidebars to maintain a sense of spatial awareness as the user scrolls content beneath them.

## Shapes

The design system employs a **Rounded** shape language to soften the "hard" technical nature of the pure black and indigo palette. Standard containers and cards use a `1rem` (16px) radius, while smaller interactive elements like buttons and input fields use `0.5rem` (8px). This creates a approachable, modern silhouette that balances the sharp, futuristic typography.

## Components

**Buttons:** Primary buttons are solid Indigo (`#6366f1`) with white text. Secondary buttons use a subtle "Ghost" style: a transparent background with a 1px border at 15% white opacity, transitioning to 30% on hover.

**Inputs:** Input fields are Surface-low with a 1px border. On focus, the border transitions to Indigo and gains a soft 2px outer glow. Labels are positioned above the field in `label-md` style.

**Sidebars:** The sidebar uses a permanent `backdrop-filter` and a Surface-low fill. Active navigation items are indicated by a vertical Indigo pill on the left edge and a subtle Indigo tint (10% opacity) on the item background.

**Cards:** Cards are the primary organizational unit. They use Surface-low backgrounds and contain subtle 1px internal dividers to separate headers from body content.

**Chips/Tags:** Used for metadata. These are dark grey (`#1a1a1a`) with `body-sm` text, utilizing the full `rounded-xl` pill shape.