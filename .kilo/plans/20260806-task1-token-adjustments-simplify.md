# Task 1 — Theme Token Adjustments: Code Simplification Plan

**Step:** 4.3 (part B) — Code Simplifier review  
**Date:** 2026-08-06  
**Scope:** wording, conciseness, and clarity improvements in the five files modified during 4.2  
**Constraints:** token values, token names, and theme architecture are locked by the front-end spec

---

## Findings Summary

All five files are technically correct and the token values match the spec. However, several files contain redundant or overly verbose prose that duplicates information already held in `brief.md §5` (the declared source of truth). The most significant opportunity is the 52-line header comment in `src/theme/_variables.scss`, which largely repeats brief.md and the inline TOKEN GROUPS section.

No file violates `max-lines-per-file` or `max-depth` for its category, so the proposed changes are editorial rather than rule-enforcement.

| File | Issue | Severity |
|------|-------|----------|
| `src/theme/_variables.scss` | Header comment (52 lines) duplicates brief.md prose, TOKEN GROUPS detail, and accent-discipline rules | High |
| `.agent/project-info/brief.md` §5 | One very long note line; L* gap wording is slightly inconsistent | Low |
| `docs/THEME.md` | Surface paragraph contains a temporal "now" clause that will stale and may overstate the clearest gap | Low |
| `docs/CONSUMER_GUIDE.md` | Intro and a few checklist items use more words than needed for an AI-agent integration guide | Medium |
| `docs/theme-preview.html` | Top comment (15 lines) and hint text are more verbose than necessary | Medium |

---

## Proposed Replacements

### 1. `src/theme/_variables.scss` — shorten header comment

**Lines to replace:** 1–52 (entire header block)

**Current:**

```scss
/**
 * Design tokens — `:root` / `--cba-` prefix.
 *
 * SOURCE OF TRUTH: .agent/project-info/brief.md §5
 * FRONT-END SPEC:  .kilo/plans/20260806-task1-token-adjustments-frontend-spec.md
 *
 * Theme name: Minimal Yet Warm — warm sand / cream / taupe + controlled coral.
 * Canvas is a darker warm sand (C5BFAE) that reads as the "floor"; panels are a
 * warm cream (E6DDC6) so modules read as cards; elevated surfaces are a warm
 * cream (FBF7ED), the lightest intentional surface, for module headers /
 * dropdowns; insets use warm sand (D8C3A5) for table headers / input wells /
 * module footers. Four obviously distinct surfaces: canvas → panel step ≈ 11 L*,
 * panel → elevated ≈ 9 L*, inset sits ≈ 8 L* below panel; elevated → inset ≈ 17 L*.
 *
 * Text tokens are warm near-black/taupe; primary/secondary pass WCAG AA on every
 * surface; muted passes AA on panel and elevated, and is RESTRICTED on the darker
 * canvas (C5BFAE: ~3.6:1) and on `--cba-bg-tertiary` (inset sand: ~3.86:1) —
 * use `--cba-text-secondary` on those surfaces.
 *
 * TOKEN GROUPS:
 *   Backgrounds  — canvas (primary), panel (secondary), inset (tertiary),
 *                  elevated (cream, highest). Use primary for workspace, secondary
 *                  for module body / cards, tertiary for recessed regions (table
 *                  headers / wells / module footer), elevated for module header,
 *                  dropdowns, popovers.
 *   Text         — primary (#2B2620) body, secondary (#4A4640) lower emphasis,
 *                  muted (#625C55) de-emphasized (NOT on bg-tertiary or darker canvas), inverse
 *                  (#FDFCF8) on dark accents/overlays.
 *   Borders      — subtle (#DAD7CA) thin separators, default (#A7A6A2) input
 *                  borders / chrome, strong (#8E8D8A) focus / footer pills / header
 *                  icon-button outlines so they do not disappear on cream/sand.
 *   Accents      — primary warm taupe (#6B5B4F, NOT coral); success calm green
 *                  (#3E6B4F); warning soft coral (#E98074); danger deeper coral-red
 *                  (#B93E36); info muted steel (#56717E). See accent-discipline note.
 *   Interactive  — hover/active use warm taupe overlays (rgba(43,38,32,...)) so they
 *                  read on cream/sand. focus-ring is a warm coral ring so it is visible
 *                  on light warm surfaces.
 *   Layout       — Fixed dimensions for Shell header / footer / module header.
 *   Radius       — sm (6px), md (10px), lg (14px).
 *   Shadows      — Warm-tinted (rgba(43,34,28,...)) so modules lift off canvas
 *                  without harsh black bloom.
 *   Spacing      — 4px-based scale 4px…32px.
 *
 * ACCENT DISCIPLINE — coral (#E98074 soft / #E85A4F strong) is RESERVED for:
 *   - warning states and badges/borders,
 *   - danger / error states and badges,
 *   - focus-ring emphasis,
 *   - small emphasis accents (icons, links, dots).
 * Coral MUST NOT be used as a large background fill for panels, modules, or primary
 * CTAs. Primary CTAs use the warm taupe `--cba-accent-primary`.
 *
 * Do NOT rename tokens. Do NOT hard-code color values in components — always
 * reference var(--cba-*). When adding new tokens, update brief.md §5 first.
 */
```

**Replacement:**

```scss
/**
 * Design tokens — `:root` / `--cba-` prefix.
 *
 * SOURCE OF TRUTH: .agent/project-info/brief.md §5
 * FRONT-END SPEC:  .kilo/plans/20260806-task1-token-adjustments-frontend-spec.md
 *
 * Minimal Yet Warm: canvas → panel → elevated → inset, with coral reserved for
 * accents/status/focus. See brief.md §5 for the full palette, L* gaps, WCAG
 * notes, and accent-discipline rules.
 *
 * TOKEN GROUPS:
 *   Backgrounds  — canvas, panel, inset, elevated (lightest).
 *   Text         — primary, secondary, muted (restricted on canvas/inset), inverse.
 *   Borders      — subtle, default, strong.
 *   Accents      — primary (taupe), success, warning, danger, info.
 *   Interactive  — hover/active overlays, warm-coral focus-ring.
 *   Layout       — header/footer/module-header dimensions.
 *   Radius       — sm, md, lg.
 *   Shadows      — warm-tinted.
 *   Spacing      — 4px-based scale.
 *
 * Do NOT hard-code color values in components; reference var(--cba-*).
 */
```

**Rationale:**
- Removes surface-description prose that duplicates brief.md §5.
- Removes inline hex values from TOKEN GROUPS; brief.md and `_variables.scss` `:root` block already contain them.
- Removes ACCENT DISCIPLINE section; brief.md owns that rule.
- Removes "Do NOT rename tokens" and "update brief.md first" admonitions already enforced by workflow/rules and the source-of-truth pointer.
- Reduces header from ~52 lines to ~26 lines without losing traceability.

---

### 2. `.agent/project-info/brief.md` §5 — tighten L* gap wording

**Line to replace:** 101

**Current:**

```markdown
> **Note:** The palette is **Minimal Yet Warm** (warm sand/cream/taupe + controlled coral). Canvas `#C5BFAE` (warm sand floor), panel `#E6DDC6` (warm cream), elevated `#FBF7ED` (warm cream, lightest surface), inset `#D8C3A5` (warm sand). Canvas → panel step ≈ 11 L\*, panel → elevated ≈ 9 L\*, inset sits ≈ 8 L\* below panel. Coral (`#E98074` soft, `#E85A4F` strong) is reserved for accent/status/focus — NOT for primary CTAs or large fills. Primary/secondary text pass WCAG AA on every intended surface. Muted text is RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) AND on `--cba-bg-tertiary` (inset sand, ~3.86:1) — use `--cba-text-secondary` on those surfaces.
```

**Replacement:**

```markdown
> **Note:** The palette is **Minimal Yet Warm** (warm sand/cream/taupe + controlled coral). Canvas `#C5BFAE` (warm sand floor), panel `#E6DDC6` (warm cream), elevated `#FBF7ED` (warm cream, lightest surface), inset `#D8C3A5` (warm sand). Canvas → panel ≈ 11 L\*, panel → elevated ≈ 9 L\*, panel → inset ≈ 8 L\*. Coral (`#E98074` soft, `#E85A4F` strong) is reserved for accent/status/focus — NOT for primary CTAs or large fills. Primary/secondary text pass WCAG AA on every intended surface. Muted text is RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) AND on `--cba-bg-tertiary` (inset sand, ~3.86:1) — use `--cba-text-secondary` on those surfaces.
```

**Rationale:** Parallel structure for the three gap statements; no loss of meaning.

---

### 3. `docs/THEME.md` — remove stale/overstated clause

**Lines to replace:** 48–53

**Current:**

```markdown
Minimal Yet Warm is a **four-level surface system**: canvas (`--cba-bg-primary`,
darker warm sand; workspace floor) → panel (`--cba-bg-secondary`, warm cream; module
body) → elevated (`--cba-bg-elevated`, warm cream, lightest surface; module header /
dropdowns) → inset (`--cba-bg-tertiary`, warm sand; table headers / wells). Panel→elevated
is now the clearest step in the stack. The hierarchy only survives in the running Shell if
**each surface is painted by its owner** (Shell / Lib / MFE). See the [Consumer Guide](CONSUMER_GUIDE.md)
for the surface ownership map and the Shell/MFE checklists.
```

**Replacement:**

```markdown
Minimal Yet Warm is a **four-level surface system**: canvas (`--cba-bg-primary`,
darker warm sand; workspace floor) → panel (`--cba-bg-secondary`, warm cream; module
body) → elevated (`--cba-bg-elevated`, warm cream, lightest surface; module header /
dropdowns) → inset (`--cba-bg-tertiary`, warm sand; table headers / wells). The hierarchy
survives only if **each surface is painted by its owner** (Shell / Lib / MFE). See the
[Consumer Guide](CONSUMER_GUIDE.md) for the ownership map and checklists.
```

**Rationale:**
- Removes "Panel→elevated is now the clearest step in the stack" — the temporal "now" will stale, and the statement overstates the clearest gap (elevated→inset is larger per the spec).
- Tightens "only survives in the running Shell if" → "survives only if".

---

### 4. `docs/CONSUMER_GUIDE.md` — tighten integration prose

#### 4a. Intro paragraph

**Lines to replace:** 14–16

**Current:**

```markdown
How to integrate the **Minimal Yet Warm** theme so the four-level surface hierarchy
(canvas → panel → elevated → inset) reads correctly in the running Shell. This guide is
normative for **Shell** and **MFE** authors (and AI agents generating those apps).
```

**Replacement:**

```markdown
Integration rules for **Shell** and **MFE** authors so the four-level surface hierarchy
(canvas → panel → elevated → inset) reads correctly.
```

#### 4b. Source-of-truth paragraph

**Lines to replace:** 18–20

**Current:**

```markdown
Authoritative token values live in [`brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme)
and [`src/theme/_variables.scss`](../src/theme/_variables.scss). This guide only states
*who applies which token where*; it never re-declares hex values.
```

**Replacement:**

```markdown
Token values live in [`brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme)
and [`src/theme/_variables.scss`](../src/theme/_variables.scss). This guide states *who
applies which token where*.
```

#### 4c. Anti-pattern bullet

**Lines to replace:** 103–105

**Current:**

```markdown
- Secondary buttons (`--cba-bg-elevated`) that collapse visually into their panel container
  or into their own active/pressed state — the elevated/panel L* separation must stay
  visible and the active state must use a distinct token/overlay.
```

**Replacement:**

```markdown
- Secondary buttons that collapse into their panel or active state. Keep the elevated/panel
  separation visible and use a distinct token/overlay for active.
```

#### 4d. Quick-verify item 6

**Lines to replace:** 117–118

**Current:**

```markdown
6. Secondary buttons are visibly distinct from the panel they sit on AND from their own
   active/pressed state.
```

**Replacement:**

```markdown
6. Secondary buttons differ from their panel and from their active/pressed state.
```

**Rationale:** Direct, active-voice wording is better suited to a checklist for AI agents.

---

### 5. `docs/theme-preview.html` — shorten comments and hint

#### 5a. Top HTML comment

**Lines to replace:** 1–15

**Current:**

```html
<!--
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui (Phase 9 — Minimal Yet Warm surface hierarchy; refined 2026-08-06: panel/elevated tokens adjusted).
  Other themes were removed; the theme-list UI is kept so future themes can be
  appended to the `themes` array below. Preview CSS custom properties mirror the
  `--cba-*` tokens defined in src/theme/_variables.scss (see brief.md §5).

  AI-AGENT GUIDE — How to update this preview when tokens change:
  1. Open src/theme/_variables.scss and read the new --cba-* values.
  2. Update the `.preview` CSS block: sync --canvas, --panel, --elevated, --inset,
     --text, --text-2, --text-3, --border, --border-2, --accent, --success,
     --warning, --danger, --info, --shadow, --hover, --on-accent with the new values.
  3. Update the `themes` array (JS): set `tokens` keys to match the new values,
     and update `source` hex array to the key palette swatches.
  4. Verify visually: canvas ≠ panel ≠ elevated ≠ inset; borders visible on cream;
     coral only on accents/status. Open in browser to confirm.
-->
```

**Replacement:**

```html
<!--
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui — Minimal Yet Warm (refined 2026-08-06).
  Preview CSS custom properties mirror `--cba-*` tokens from src/theme/_variables.scss.
  Update both the `.preview` CSS block and the JS `themes` array when tokens change.
  Verify: canvas ≠ panel ≠ elevated ≠ inset; borders visible; coral only on accents.
-->
```

#### 5b. Hint text

**Line to replace:** 101

**Current:**

```html
<p class="hint">Palette preview for @cobranza-apps/ui — Minimal Yet Warm (refined 2026-08-06: panel darkened to warm cream, elevated given a cream tint; panel→elevated gap widened). Canvas ≠ panel ≠ elevated ≠ inset, coral reserved for accents.</p>
```

**Replacement:**

```html
<p class="hint">Minimal Yet Warm preview (refined 2026-08-06). Panel and elevated are now clearly separated; coral is reserved for accents.</p>
```

**Rationale:** The preview already visually shows the surface distinction; the hint only needs to label the theme and state the two key takeaways.

---

## Verification After Applying Simplifications

1. `src/theme/_variables.scss` still declares the correct token values and preserves the source-of-truth / front-end-spec pointers.
2. No token value, token name, or theme-architecture change is introduced.
3. `npm run build` and `npm run lint` remain green (no code logic changed).
4. `docs/theme-preview.html` still renders the same visual distinction.

---

## What Was NOT Reviewed / Out of Scope

- Token values (locked by front-end spec).
- Token names / theme architecture (locked by spec).
- Files outside the five listed in the task prompt.
- `docs/USAGE.md` drift (already flagged in the implementation plan as a caller decision).
- Structural refactoring of `theme-preview.html` beyond comments/hint (theme-list UI intentionally retained for future themes).
