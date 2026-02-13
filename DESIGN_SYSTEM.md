# CryptoAlert Pro — Design System

> Strict specification for all UI elements. Every component, token, and pattern used in this application is documented below. No deviations allowed.

---

## 1. Design Tokens

### 1.1 Colors

| Token            | Hex       | Usage                                      |
|------------------|-----------|---------------------------------------------|
| `--bg`           | `#f8fafd` | Page background, input backgrounds          |
| `--white`        | `#ffffff` | Cards, nav, table, modals                   |
| `--text-1`       | `#222531` | Primary text (headings, body, values)       |
| `--text-2`       | `#58667e` | Secondary text (nav links, muted content)   |
| `--text-3`       | `#808a9d` | Tertiary text (labels, placeholders, ranks) |
| `--border`       | `#eff2f5` | Light borders, dividers, tag backgrounds    |
| `--border-2`     | `#e5e9ef` | Input borders, heavier dividers             |
| `--green`        | `#16c784` | Positive change, success states             |
| `--red`          | `#ea3943` | Negative change, error states               |
| `--blue`         | `#3861fb` | Primary action (buttons, focus rings)       |
| `--blue-hover`   | `#1e40af` | Primary action hover state                  |
| `--row-hover`    | `#f8fafd` | Table row hover background                  |
| `--alert-hit-bg` | `#fef2f2` | Triggered alert row background              |
| `--alert-hit-text`| `#991b1b`| Triggered alert row text                    |

**Additional one-off colors (not tokenized):**

| Hex              | Usage                                       |
|------------------|----------------------------------------------|
| `#f5c518`        | Starred/favorited state (star icon)          |
| `#eef2ff`        | Dropdown menu item hover                     |
| `#dbeafe`        | Dropdown menu item selected                  |
| `rgba(0,0,0,.45)`| Modal overlay backdrop                       |
| `rgba(0,0,0,.1)` | Toast shadow                                 |
| `rgba(0,0,0,.15)`| Modal shadow                                 |
| `rgba(56,97,251,0.12)` | Input focus ring (blue glow)           |

### 1.2 Typography

| Property          | Value                                                  |
|-------------------|--------------------------------------------------------|
| Font Family       | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` |
| Font Weights      | 400 (regular), 500 (medium), 600 (semibold), 700 (bold) |
| Base Font Size    | `14px`                                                 |
| Line Height       | `1.5`                                                  |
| Rendering         | `-webkit-font-smoothing: antialiased`                  |

**Type Scale:**

| Size   | Weight | Usage                                          |
|--------|--------|-------------------------------------------------|
| `18px` | 700    | Logo text                                       |
| `16px` | 700    | Card headings (`h2`), Modal headings (`h3`)     |
| `14px` | 600    | Button text, nav links, input text, coin names  |
| `14px` | 500    | Nav links, percentage values, alert tags         |
| `14px` | 400    | Body text, dropdown items                        |
| `13px` | 500    | Rank numbers, search input, modal body text      |
| `12px` | 600    | Form labels (uppercase), table headers, stats bar |
| `12px` | 500    | Coin symbols, tag text                           |
| `11px` | 400    | Sub-values, detail labels                        |

**Label Style:**
- `text-transform: uppercase`
- `letter-spacing: 0.03em`
- `color: var(--text-3)`

### 1.3 Spacing

| Token      | Value  | Usage                             |
|------------|--------|-----------------------------------|
| Page gutter| `24px` | Horizontal padding on all bars    |
| Card padding| `20px`| Internal padding of alert card    |
| Form gap   | `12px` | Vertical gap between form fields  |
| Field row gap| `10px`| Gap in two-column field rows     |
| Nav gap    | `24px` | Gap between nav sections          |
| Nav link gap| `4px` | Gap between nav link items        |
| Stats gap  | `16px` | Gap between header stat items     |
| Footer gap | `20px` | Gap between footer stat items     |
| Tag gap    | `6px`  | Gap between alert tags            |
| Table cell | `14px 10px` | Table `td` padding           |
| Table header| `12px 10px`| Table `th` padding           |

### 1.4 Border Radius

| Value  | Usage                                           |
|--------|-------------------------------------------------|
| `6px`  | Alert tags                                      |
| `8px`  | Cards, inputs, buttons, nav links, search, toast|
| `12px` | Modals, dropdown menus                          |
| `50%`  | Coin icons (circular)                           |

### 1.5 Shadows

| Shadow                               | Usage              |
|--------------------------------------|--------------------|
| `0 8px 24px rgba(0,0,0,0.1)`        | Dropdown menus     |
| `0 4px 16px rgba(0,0,0,0.1)`        | Toast notification |
| `0 20px 60px rgba(0,0,0,0.15)`      | Modal dialog       |
| `0 0 0 3px rgba(56,97,251,0.12)`    | Input focus ring   |

### 1.6 Transitions

| Property         | Duration | Usage                       |
|------------------|----------|-----------------------------|
| `background`     | `0.15s`  | Buttons, nav links          |
| `border-color`   | `0.15s`  | Inputs, custom selects      |
| `box-shadow`     | `0.15s`  | Custom select focus          |
| `background`     | `0.1s`   | Table rows, dropdown items  |
| `transform`      | `0.2s`   | Dropdown arrow rotation     |

---

## 2. Layout

### 2.1 Page Structure

```
┌─────────────────────────────────────┐
│ Top Header (stats bar)              │  sticky: no
├─────────────────────────────────────┤
│ Nav Bar                             │  sticky: top: 0, z-index: 100
├──────────┬──────────────────────────┤
│ Left     │ Right Panel              │  workspace: grid
│ Panel    │ (Table)                  │  columns: 320px 1fr
│ (Alert)  │                          │  gap: 16px
│          │                          │  left: sticky top: 72px
├──────────┴──────────────────────────┤
│ Bottom Bar (stats footer)           │  sticky: bottom: 0, z-index: 50
└─────────────────────────────────────┘
```

- Max width: `1400px`, centered with `margin: 0 auto`
- Workspace padding: `16px 24px 24px`

### 2.2 Responsive Breakpoint

| Breakpoint       | Change                                  |
|------------------|-----------------------------------------|
| `max-width: 1100px` | Grid becomes single column (`1fr`)  |
|                  | Left panel loses sticky positioning      |
|                  | Nav links hidden                         |
|                  | Stats font shrinks to `11px`, gap `10px` |

---

## 3. Components

### 3.1 Top Header

- Background: `--white`
- Border bottom: `1px solid var(--border)`
- Font size: `12px`
- Color: `--text-3`
- Inner padding: `8px 24px`
- Stat labels: regular weight, values: `600` weight in `--text-1`
- Change indicators: `.ch.up` = `--green`, `.ch.down` = `--red`, weight `500`

### 3.2 Nav Bar

- Height: `56px`
- Background: `--white`
- Border bottom: `1px solid var(--border)`
- Sticky: `top: 0`, `z-index: 100`
- Logo: `18px` / `700` weight, icon `22x22`
- Links: `14px` / `500`, color `--text-2`, padding `6px 12px`, radius `8px`
- Link active/hover: background `--border`, color `--text-1`
- Search: background `--border`, radius `8px`, padding `8px 12px`, input width `140px`
- Login button: `--blue` bg, `#fff` text, `600` weight, padding `8px 20px`, radius `8px`

### 3.3 Alert Card

- Background: `--white`
- Border: `1px solid var(--border)`
- Border radius: `8px`
- Padding: `20px`
- Heading: icon `18x18` + `h2` at `16px`/`700`
- Margin below heading: `16px`

### 3.4 Form Fields

**Text/Number/Email Input:**
- Padding: `10px 12px`
- Background: `--bg`
- Border: `1px solid var(--border-2)`
- Border radius: `8px`
- Font: `14px`, color `--text-1`
- Focus: border `--blue`, no outline

**Custom Select (Dropdown):**
- Trigger: same visual as text input + chevron arrow (`12x12` SVG)
- Trigger hover: `border-color: var(--text-3)`
- Trigger open: `border-color: var(--blue)`, `box-shadow: 0 0 0 3px rgba(56,97,251,0.12)`
- Arrow: rotates 180deg when open
- Menu: absolute, `top: calc(100% + 4px)`, bg `--white`, border `1px solid var(--border-2)`, radius `12px`, shadow `0 8px 24px rgba(0,0,0,0.1)`, padding `6px 0`, max-height `260px`, overflow-y auto
- Menu items: padding `10px 14px`, font `14px`, hover bg `#eef2ff`, selected bg `#dbeafe` + weight `500`

**Field Row (two-column):**
- Grid: `1fr 1fr`, gap `10px`

### 3.5 Buttons

**Primary (`.btn-alert`, `.btn-blue`, `.nav-btn-login`):**
- Background: `--blue`
- Color: `#fff`
- Font weight: `600`
- Border: none
- Border radius: `8px`
- Hover: `--blue-hover`
- `.btn-alert` padding: `12px` (full width)
- `.btn-blue` padding: `8px 16px`
- `.nav-btn-login` padding: `8px 20px`

**Ghost (`.btn-ghost`):**
- Background: `--white`
- Border: `1px solid var(--border-2)`
- Color: `--text-2`
- Font weight: `500`
- Border radius: `8px`
- Padding: `8px 16px`
- Hover: `background: var(--bg)`

### 3.6 Alert Tags

- Container: flex wrap, gap `6px`, margin-top `12px`
- Tag: inline-flex, gap `4px`, padding `4px 8px`, bg `--border`, radius `6px`, font `12px`/`500`, color `--text-2`
- Delete button: no bg/border, color `--text-3`, font `14px`, hover color `--red`

### 3.7 Data Table (`.cmc-table`)

**General:**
- Full width, `border-collapse: collapse`, font `14px`

**Header (`th`):**
- Background: `--white`
- Text align: center (except `.th-name`: left)
- Padding: `12px 10px`
- Font: `12px`/`600`, color `--text-3`
- Border bottom: `1px solid var(--border)`
- Star column: width `48px`, padding-left `16px`
- Rank column: width `40px`
- Chart column: width `140px`

**Cells (`td`):**
- Padding: `14px 10px`
- Border bottom: `1px solid var(--border)`
- Text align: center (except name: left via flex)
- Vertical align: middle

**Row States:**
- Hover: `background: var(--row-hover)`
- Alert hit: `background: var(--alert-hit-bg)`, text `var(--alert-hit-text)`

**Star Cell:**
- Font: `18px`, color `--text-3`
- Hover: `#f5c518`
- Starred (`.starred`): `#f5c518`
- Padding-left: `16px`

**Rank Cell:**
- Font: `13px`/`500`, color `--text-3`

**Name Cell (`.td-name`):**
- Flex row, gap `10px`, text-align left
- Coin icon: `24x24`, `border-radius: 50%`, `object-fit: contain`
- Coin name: weight `600`, color `--text-1`
- Coin symbol: `12px`/`500`, color `--text-3`, margin-left `6px`

**Price Cell:** weight `600`

**Percentage Cell:** weight `500`
- `.pct-up`: `--green`
- `.pct-down`: `--red`
- `.pct-na`: `--text-3`

**Chart Cell:**
- SVG: `120x36`, overflow visible
- Stroke width: `1.5`, round caps/joins
- Up color: `#16c784`, down color: `#ea3943`

### 3.8 Bottom Bar

- Background: `--white`
- Border top: `1px solid var(--border)`
- Padding: `8px 24px`
- Font: `12px`, color `--text-3`
- Sticky: `bottom: 0`, `z-index: 50`
- Inner: flex, gap `20px`, wrap
- Same stat styling as top header

### 3.9 Modal

**Overlay:**
- Fixed, inset `0`, bg `rgba(0,0,0,.45)`, z-index `1000`, padding `24px`
- Hidden by default (`display: none`), shown with `.is-open` (`display: flex`)

**Dialog:**
- Max width: `480px`, full width
- Background: `--white`, radius `12px`, padding `24px`
- Shadow: `0 20px 60px rgba(0,0,0,.15)`

**Header:** flex, space-between, margin-bottom `16px`
- Title: `16px`/`700`
- Close button: `32x32`, bg `--border`, radius `8px`, font `20px`, hover bg `--border-2`

**Body:**
- Background: `--bg`, radius `8px`, padding `16px`
- Font: `13px`, color `--text-2`
- Details grid: `1fr 1fr`, gap `10px`

**Footer:** flex, justify-end, gap `8px`

### 3.10 Toast

- Fixed: `bottom: 56px`, `right: 24px`
- Flex, gap `8px`, padding `12px 16px`
- Background: `--white`
- Border: `1px solid var(--border-2)`
- Border radius: `8px`
- Shadow: `0 4px 16px rgba(0,0,0,.1)`
- Z-index: `1001`
- Font weight: `500`, color `--text-1`
- Icon: `16x16` checkmark SVG, stroke `#16c784`, stroke-width `3`
- Auto-dismiss after `3000ms`

---

## 4. Iconography

| Icon            | Size    | Source          | Usage                    |
|-----------------|---------|-----------------|--------------------------|
| CMC Logo        | `22x22` | Inline SVG      | Nav logo                 |
| Search          | `14x14` | Inline SVG      | Nav search               |
| Bell            | `18x18` | Inline SVG      | Alert card heading       |
| Chevron down    | `12x12` | Inline SVG      | Custom select arrow      |
| Checkmark       | `16x16` | Inline SVG      | Toast success            |
| Coin logos      | `24x24` | CoinGecko CDN   | Table name column        |
| Star (text)     | `18px`  | Unicode ☆/★     | Table favorite toggle    |

**Coin Logo URLs (CoinGecko CDN `assets.coingecko.com`):**

| Coin     | Path                                        |
|----------|----------------------------------------------|
| Bitcoin  | `/coins/images/1/small/bitcoin.png`          |
| Ethereum | `/coins/images/279/small/ethereum.png`       |
| Solana   | `/coins/images/4128/small/solana.png`        |
| XRP      | `/coins/images/44/small/xrp-symbol-white-128.png` |
| BNB      | `/coins/images/825/small/bnb-icon2_2x.png`  |
| Dogecoin | `/coins/images/5/small/dogecoin.png`         |
| TRON     | `/coins/images/1094/small/tron-logo.png`     |
| Cardano  | `/coins/images/975/small/cardano.png`        |

---

## 5. Interaction States

| Element          | Default              | Hover                 | Active/Focus             |
|------------------|----------------------|-----------------------|--------------------------|
| Primary button   | `--blue` bg          | `--blue-hover` bg     | —                        |
| Ghost button     | `--white` bg         | `--bg` bg             | —                        |
| Nav link         | `--text-2` color     | `--border` bg, `--text-1` color | `.active` same as hover |
| Text input       | `--border-2` border  | —                     | `--blue` border          |
| Custom select    | `--border-2` border  | `--text-3` border     | `--blue` border + ring   |
| Dropdown item    | transparent bg       | `#eef2ff` bg          | `.selected`: `#dbeafe` bg|
| Table row        | transparent bg       | `--row-hover` bg      | —                        |
| Star icon        | `--text-3` color     | `#f5c518` color       | `.starred`: `#f5c518`    |
| Modal close      | `--border` bg        | `--border-2` bg       | —                        |
| Alert tag delete | `--text-3` color     | `--red` color         | —                        |

---

## 6. Z-Index Scale

| Value  | Element           |
|--------|-------------------|
| `50`   | Bottom bar        |
| `100`  | Nav bar (sticky)  |
| `200`  | Dropdown menus    |
| `1000` | Modal overlay     |
| `1001` | Toast notification|

---

## 7. Data Format Rules

| Data Type         | Format                              | Example         |
|-------------------|-------------------------------------|-----------------|
| USD (>= $1T)     | `$X.XXT`                           | `$1.33T`        |
| USD (>= $1B)     | `$X.XXB`                           | `$235.01B`      |
| USD (>= $1M)     | `$X.XXM`                           | `$48.31M`       |
| USD (>= $1)      | `$X,XXX.XX` (locale)               | `$66,420.00`    |
| USD (< $1)       | `$0.XXXXXX` (up to 6 decimals)     | `$0.092612`     |
| Percentage        | `X.XX%` (absolute value)           | `2.13%`         |
| Percentage arrow  | `▲` positive, `▼` negative          | `▼ 2.13%`       |
| Supply (>= 1B)   | `X.XXB SYM`                        | `19.99M BTC`    |
| Supply (>= 1M)   | `X.XXM SYM`                        | `120.69M ETH`   |
| Null/missing      | `--`                                | `--`            |
| Dominance         | `X.X%`                             | `52.3%`         |

---

## 8. File Structure

```
public/
├── index.html      # Page structure (semantic HTML5)
├── styles.css      # All styles (single file, CSS custom properties)
└── app.js          # All frontend logic (vanilla JS, no framework)
```

No build tools. No preprocessors. No CSS-in-JS. Pure HTML + CSS + JS.
