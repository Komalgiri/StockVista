---
name: Opp Code Stock Vision Financial Terminal
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
  on-surface-variant: '#444653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#2d3449'
  on-tertiary: '#ffffff'
  tertiary-container: '#434b60'
  on-tertiary-container: '#b4bbd5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  surface-canvas: '#FFFFFF'
  surface-subtle: '#F8FAFC'
  surface-muted: '#F1F5F9'
  border-hairline: '#E2E8F0'
  border-strong: '#CBD5E1'
  text-primary: '#0F172A'
  text-secondary: '#475569'
  text-tertiary: '#94A3B8'
  market-positive: '#16A34A'
  market-positive-subtle: '#DCFCE7'
  market-negative: '#DC2626'
  market-negative-subtle: '#FEE2E2'
  market-neutral: '#EAB308'
  market-neutral-subtle: '#FEF9C3'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  title-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  metric-display:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.03em
  data-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  code-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-caps:
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
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system delivers an institutional-grade financial equity research environment calibrated specifically for Indian capital market analysts, retail power investors, and portfolio managers. The aesthetic balances analytical rigor with modern clarity, avoiding consumer fintech gimmicks, superfluous glassmorphism, or heavy decorative gradients.

The brand personality conveys uncompromising accuracy, speed, and structural integrity. Every pixel emphasizes data legibility, tabular density, and clear scan paths. The visual language leans on a **Corporate / Modern Terminal** hybrid: crisp hairline dividers, structured slate containers, dedicated monetary alignments, and unmistakable semantic cues for market performance. Visual hierarchies are defined through subtle surface tiering and disciplined typographic contrast rather than dramatic elevation or drop shadows.

## Colors

The color palette is built around high-contrast legibility against pure white and cool slate foundations. 

- **Primary (`#1E40AF`) & Secondary (`#2563EB`)**: Royal blue tones signify institutional precision, active selections, primary interactive states, and core navigational waypoints.
- **Surface Neutrals**: `#FFFFFF` provides the primary canvas base, supported by `#F8FAFC` (slate-50) for secondary data panels and `#F1F5F9` (slate-100) for nested table headers and input fills.
- **Dividers & Structural Borders**: Hairline strokes leverage `#E2E8F0` (slate-200) to partition dense data points without visual fatigue, elevated to `#CBD5E1` for hover states and form perimeters.
- **Market Semantic System**: Market gains demand absolute clarity via `#16A34A` (positive green) with `#DCFCE7` backgrounds for pill indicators. Downward movement and risk factors utilize `#DC2626` (negative red) paired with `#FEE2E2`. These semantic accents are restricted strictly to metric shifts, financial statements, and performance indicators to protect their cognitive weight.

## Typography

Typography balances clean structural headers, ultra-legible body text, and tabular numerical rendering.

- **Type Scale Execution**: `Geist` provides structural confidence for high-level market summaries, stock tickers, and quarterly report banners. `Inter` serves as the primary workhorse across all documentation, ratios, and balance sheet tables. `JetBrains Mono` handles security codes (ISIN, BSE/NSE script codes), timestamp tracking, and formula queries.
- **Tabular Lining Requirements**: All numeric components, P/E multiples, and currency figures (₹ Cr / ₹ L) must implement `font-variant-numeric: tabular-nums` or `tnum` in CSS/Tailwind. Numeric values across financial statement rows must strictly right-align with matching column widths to facilitate instant vertical comparison.
- **Labeling Disciplines**: Metadata descriptions, trailing quarters, and column categories use `label-caps` rendered in uppercase with subtle positive letter spacing (`0.04em`) to establish clear hierarchy without demanding heavy font weights.

## Layout & Spacing

The layout is built upon a high-density, 12-column responsive fluid grid structured for multi-panel financial analytical workspaces.

- **Grid Architecture**: 
  - **Desktop (≥ 1280px)**: 12-column grid with a fixed max-width container of `1536px` (`2xl`), `1.5rem` (`24px`) gutters, and `2rem` outer padding. Main panel accommodates a 3-column split (e.g., Screener sidebar at 3 cols, main financials at 9 cols).
  - **Tablet (768px – 1279px)**: 8-column layout with `1rem` gutters; secondary financial charts wrap beneath summary tables.
  - **Mobile (< 768px)**: 4-column layout with `1rem` margins. Complex financial tables switch to horizontal lock scroll with frozen lead columns (e.g., metric names stick left while historical years scroll horizontally).
- **Density Philosophy**: Spacing within data views defaults to compact rhythms. Ratios and key metrics use `0.5rem` to `0.75rem` vertical cell padding, preserving maximum viewport real estate for vertical comparisons of multiple fiscal years.

## Elevation & Depth

Visual depth is achieved through structural border lines, distinct surface backgrounds, and minimal ambient shadows.

- **Tonal Layering**: The primary foundation is clean white (`#FFFFFF`). Secondary sidebars, toolbars, and inactive tabular rows step into `#F8FAFC`. Active filter bars and hover selections transition softly into `#F1F5F9`.
- **Low-Contrast Hairlines**: Component segregation relies entirely on crisp 1px borders in `#E2E8F0`. Shadows are eliminated across static structural cards, metric summary blocks, and financial grids.
- **Floating Overlays & Context Menus**: Tooltips, autocompletion dropdowns, and modal dialogs rely on an ultra-diffused, sharp shadow token: `box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)`. All elevated menus must maintain a 1px border stroke using `#CBD5E1`.

## Shapes

The design system maintains a disciplined, restrained corner geometry (`roundedness: 1`). 

- **Containers & Data Cards**: Corner radii stay fixed at `0.375rem` (`rounded-md`, 6px) to maximize internal surface area and avoid rounded edge distortion on dense tabular grids.
- **Controls & Form Elements**: Input fields, dropdown triggers, and buttons leverage `0.25rem` (`rounded`, 4px) to `0.375rem` (`rounded-md`, 6px). 
- **Badges & Ratio Pills**: Performance indicators and stock tags carry a maximum radius of `0.25rem` or full pills (`9999px`) only when indicating high-level status tags (e.g., "Large Cap", "Nifty 50").

## Components

### Buttons
- **Primary**: Solid royal blue (`#1E40AF`) background, `#FFFFFF` text, `font-medium`, 6px radius (`rounded-md`). Interactive hover state deepens to `#1D4ED8` with a subtle ring on keyboard focus (`ring-2 ring-blue-500/20`).
- **Secondary / Outlined**: `#FFFFFF` background with a crisp 1px `#E2E8F0` border, `#0F172A` text, hovering to `#F8FAFC` and `#CBD5E1` border.
- **Ghost / Action**: Unbordered, transparent background with `#475569` text, used for table icon triggers, column sorters, and export actions.

### Financial Data Tables
- **Header Row**: `#F8FAFC` background, bordered with `#E2E8F0` top and bottom. Headers use `label-caps` in `#475569`, left-aligned for parameters, right-aligned for quarters and fiscal year totals.
- **Body Rows**: `#FFFFFF` canvas, alternating or hovering to `#F8FAFC` on pointer hover. Row height is strictly constrained (`36px` to `40px` max).
- **Cells**: Numbers rendered in `data-tabular` right-aligned with monospace numerals. Positive shifts prefix with `+` and color with `#16A34A`; negatives use `-` with `#DC2626`.

### Cards & Summary KPI Blocks
- **Metric Cards**: Bordered with `#E2E8F0`, zero ambient shadow, solid `#FFFFFF` fill. Includes a micro-label (`label-caps`), primary metric display (`metric-display`), and comparative delta pill beneath.

### Chips & Semantic Badges
- **Market Cap / Industry Badges**: Subtle neutral styling using `#F1F5F9` background, `#475569` text, and 4px radius.
- **Performance Badges**: Dynamic delta pills using `#DCFCE7` text/bg for positive (`#16A34A` text) and `#FEE2E2` for negative (`#DC2626` text).

### Form Inputs & Search Auto-suggest
- **Search Bar**: Dedicated omnibar input for company discovery with 1px `#CBD5E1` border, `#F8FAFC` idle background shifting to `#FFFFFF` on focus, and an integrated keyboard shortcut badge (`Ctrl + K`).
- **Checkboxes & Radios**: 4px radius for checkboxes, royal-blue checked state (`#1E40AF`) with clean white icon checkmarks.
