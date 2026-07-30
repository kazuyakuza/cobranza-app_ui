# Front-end Technical Specification — Task 5 (Phase 1: Base Typography & Defaults)

**Library:** `@cobranza-apps/ui`  
**File under specification:** `src/lib/theme/_base.scss`  
**Import location:** `src/lib/theme/theme.scss` (after `_variables.scss`, before `_mixins.scss` and `_utilities.scss`)  
**Spec date:** 2026-07-30

---

## 1. Objective

Define the global base typography and sensible default styles for the design system. The rules must:

- Establish the Inter-first font stack with system fallbacks.
- Set the base font-size to `14px` and line-height to `1.5`.
- Apply the default text color via `--cba-text-primary`.
- Only apply a page background when it is safe for a library global entry (see §3.2).
- Style headings with weights between 500 and 600.
- Provide accessible defaults for links and focusable elements using `--cba-focus-ring`.
- Remain complementary to Bootstrap 5, not combative.

---

## 2. Source Tokens

All referenced tokens are defined in `src/lib/theme/_variables.scss` (brief §5):

| Token | Usage in this file |
| --- | --- |
| `--cba-text-primary` | Default body text color |
| `--cba-text-secondary` | Secondary / muted text color (optional sub-heading, small) |
| `--cba-text-muted` | Muted / placeholder text |
| `--cba-accent-primary` | Link default color |
| `--cba-accent-info` | Link hover/focus accent alternative |
| `--cba-focus-ring` | Focus outline replacement for focusable elements |
| `--cba-hover` | Subtle hover background overlay |

---

## 3. Specification

### 3.1 File path

```text
src/lib/theme/_base.scss
```

### 3.2 Global typography rules

Apply these rules on the `:root` element and `body`. Keep selectors low-specificity and avoid `!important`.

```scss
:root {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  font-size: 14px;
  line-height: 1.5;
  color: var(--cba-text-primary);
}

body {
  // Library global entry: set the default text color again so consumers
  // that import theme.scss directly get the intended foreground color.
  color: var(--cba-text-primary);

  // Background is intentionally left to the consumer (Shell / MFE).
  // Libraries should not aggressively paint the page background, because
  // Bootstrap's reboot and consumer-specific shells may already do so.
  background-color: transparent;
}
```

**Rationale for `background-color: transparent`:**  
The TODO requirement states background should be `--cba-bg-primary` only if it makes sense for the library's global entry; otherwise leave it to the consumer. Because Bootstrap 5's `reboot.scss` already sets a `body` background, forcing `--cba-bg-primary` here would fight Bootstrap and surprise consumers that load Bootstrap CSS. Therefore the spec leaves the background untouched (transparent).

### 3.3 Headings

Use native heading selectors. Avoid overriding Bootstrap's `margin-bottom` values unless necessary; keep only font-weight within the 500–600 range and inherit the system font stack.

```scss
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 600;
  line-height: 1.25;
  color: var(--cba-text-primary);
}

h1,
h2 {
  font-weight: 600;
}

h3,
h4,
h5,
h6 {
  font-weight: 500;
}
```

**Bootstrap compatibility:** Bootstrap 5 headings use `margin-top: 0`, `margin-bottom: 0.5rem`, and `line-height: 1.2`. This spec only narrows line-height to `1.25` and keeps weights in the 500–600 range, so it remains visually consistent without breaking Bootstrap spacing classes (e.g. `.mb-0`).

### 3.4 Paragraphs and small text

```scss
p {
  margin-bottom: var(--cba-space-3);
}

small,
.cba-text-small {
  font-size: 0.857rem; // ~12px at 14px base
  color: var(--cba-text-secondary);
}
```

### 3.5 Links

Provide a subtle, accessible default that does not clash with Bootstrap's `.link-primary` utilities.

```scss
a {
  color: var(--cba-accent-primary);
  text-decoration: none;

  &:hover {
    color: var(--cba-accent-info);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
    border-radius: var(--cba-radius-sm);
    box-shadow: var(--cba-focus-ring);
  }
}
```

**Bootstrap compatibility:** Bootstrap's reboot already resets `a` text-decoration and color. These rules override with the design-system accent color and a visible focus ring, which is the intended system behavior. When consumers use Bootstrap utility classes such as `.link-light` or `.text-decoration-none`, their higher-specificity classes still win.

### 3.6 Focusable elements

Apply the design-system focus ring to interactive elements that Bootstrap may also style, but only when the element is not already receiving a Bootstrap-specific focus treatment that the consumer explicitly chose.

```scss
button,
input,
textarea,
select,
a,
[tabindex]:not([tabindex='-1']) {
  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}
```

**Bootstrap compatibility:** Bootstrap 5 uses `box-shadow` for `.btn:focus-visible`, `.form-control:focus`, etc. Because this selector is less specific than Bootstrap's class-based focus rules, Bootstrap's explicit component styles continue to win. Consumers that import only the theme without Bootstrap will still get a consistent focus ring.

### 3.7 Code / preformatted text (optional, minimal)

```scss
code,
kbd,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 0.928em; // ~13px at 14px base
}
```

### 3.8 Complete file content

The final `_base.scss` must contain exactly the following sections in this order:

```scss
/**
 * Base typography and global defaults for @cobranza-apps/ui.
 * Imported by theme.scss after variables and before mixins/utilities.
 * This file intentionally does not fight Bootstrap 5; it only adds
 * complementary defaults that use the --cba-* token set.
 */

// ---------------------------------------------------------------------------
// Root typography
// ---------------------------------------------------------------------------
:root {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  font-size: 14px;
  line-height: 1.5;
  color: var(--cba-text-primary);
}

body {
  color: var(--cba-text-primary);
  background-color: transparent;
}

// ---------------------------------------------------------------------------
// Headings
// ---------------------------------------------------------------------------
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 600;
  line-height: 1.25;
  color: var(--cba-text-primary);
}

h3,
h4,
h5,
h6 {
  font-weight: 500;
}

// ---------------------------------------------------------------------------
// Body text
// ---------------------------------------------------------------------------
p {
  margin-bottom: var(--cba-space-3);
}

small,
.cba-text-small {
  font-size: 0.857rem;
  color: var(--cba-text-secondary);
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------
a {
  color: var(--cba-accent-primary);
  text-decoration: none;

  &:hover {
    color: var(--cba-accent-info);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
    border-radius: var(--cba-radius-sm);
    box-shadow: var(--cba-focus-ring);
  }
}

// ---------------------------------------------------------------------------
// Focusable elements
// ---------------------------------------------------------------------------
button,
input,
textarea,
select,
a,
[tabindex]:not([tabindex='-1']) {
  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}

// ---------------------------------------------------------------------------
// Monospace text
// ---------------------------------------------------------------------------
code,
kbd,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 0.928em;
}
```

---

## 4. Import Order in `theme.scss`

The existing import order in `src/lib/theme/theme.scss` is:

```scss
@use 'variables';
@use 'base';
@use 'mixins';
@use 'utilities';
```

No change to `theme.scss` is required beyond confirming that `@use 'base';` is present and ordered after `variables` and before `mixins`/`utilities`.

---

## 5. Bootstrap 5 Coexistence Strategy

| Area | Bootstrap 5 default | This spec's choice | Conflict? |
| --- | --- | --- | --- |
| Font stack | System sans stack | Inter first, then system stack | No — override is intentional |
| Base font-size | `1rem` (typically `16px`) | `14px` on `:root` | Yes, intentional library default; consumers may override |
| Line-height | `1.5` | `1.5` | No |
| Body color | `#212529` | `var(--cba-text-primary)` | Intentional override for dark theme |
| Body background | `white` / `--bs-body-bg` | `transparent` | No — leaves background to consumer/Bootstrap |
| Heading weight | `500` | `500–600` | No — within Bootstrap range |
| Link color | `--bs-link-color` | `var(--cba-accent-primary)` | Intentional override; utilities still work |
| Focus ring | Component-specific shadows | `--cba-focus-ring` | Only when Bootstrap classes are not used |

---

## 6. Acceptance Criteria

- [ ] `src/lib/theme/_base.scss` exists and compiles without errors.
- [ ] `:root` sets `font-family: 'Inter', system-ui, ...`, `font-size: 14px`, `line-height: 1.5`, and `color: var(--cba-text-primary)`.
- [ ] `body` sets `color: var(--cba-text-primary)` and `background-color: transparent`.
- [ ] Headings (`h1`–`h6`) use font-weights `500`–`600` and `line-height: 1.25`.
- [ ] Links use `--cba-accent-primary` by default, `--cba-accent-info` on hover, and `--cba-focus-ring` on `:focus-visible`.
- [ ] Focusable elements receive `--cba-focus-ring` on `:focus-visible` without `!important`.
- [ ] No `!important` declarations are used.
- [ ] No hard-coded colors outside the `--cba-*` token set (except system font fallbacks).
- [ ] `theme.scss` imports `_base.scss` after `_variables.scss` and before `_mixins.scss`/`_utilities.scss`.
- [ ] `npm run build` continues to pass.

---

## 7. Verification Notes for 4.5a

During implementation verification, check:

1. The compiled `theme.scss` output includes the base rules.
2. No Bootstrap-specific selectors (e.g. `.btn`, `.form-control`) are overridden directly in `_base.scss`.
3. The focus ring uses `box-shadow: var(--cba-focus-ring)` exactly.
4. The file length remains under the project's 200-line limit for source files.
