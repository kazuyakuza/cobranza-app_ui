# Task 1 — Theme Token Adjustments: Implementation Plan

**Step:** 4.1b (Analysis & Planning)
**Architector sub-agent output — Plan only. No code execution.**
**Date:** 2026-08-06
**TODO:** `.agent/todos/20260805/20260805-todo-1.md` (lines 2 & 3)
**Front-end spec (authoritative):** `.kilo/plans/20260806-task1-token-adjustments-frontend-spec.md`
**Global plan:** `.kilo/plans/20260806-theme-tokens-preview-guide.md`
**Branch:** `feat/theme-refinement-tokens-preview-guide` (already created; Steps 2 & 3 done — version bumped to `0.11.0` in commit `80cdf9d`)

---

## 1. Task Summary

Adjust two theme tokens so the **Minimal Yet Warm** four-level surface hierarchy reads clearly:

| Token | Current | New | Reason |
|-------|---------|-----|--------|
| `--cba-bg-secondary` (panel) | `#F2F0E8` | `#E6DDC6` | Darker + more warm chroma (L* 94.75 → 88.26, b* 4.10 → 12.39). Modules read as warm cream cards, not near-white sheets. |
| `--cba-bg-elevated` | `#FDFCF8` | `#FBF7ED` | Slightly darker + cream tint (L* 98.94 → 97.29, b* 2.03 → 5.27). Identifiable against panel; widens panel→elevated gap from ~4.2 L* to ~9.0 L*. |

**Unchanged (per spec §3 & constraints):** canvas `#C5BFAE`, inset `#D8C3A5`, all text tokens, all accent tokens, all borders, `--cba-text-inverse: #FDFCF8` (stays — it only coincidentally equaled the old elevated).

**Resulting L* stack (spec §4):** canvas 77.39 → inset 79.81 → panel 88.26 → elevated 97.29. Light→dark: elevated → panel → inset → canvas.

**Resulting L* gaps (spec §4.2):**
- canvas → panel: 10.87 L*
- panel → elevated: 9.02 L* (was 4.19; **the fix**)
- panel → inset: 8.45 L*
- elevated → inset: 17.48 L*

**WCAG AA (spec §5):** all intended pairs pass ≥4.5:1 on new panel/elevated. `--cba-text-muted` on panel = 4.88:1 (pass, lowest). Pre-existing restrictions (muted on canvas/inset) remain valid; no text/accent token change required.

---

## 2. Ambiguities / Out-of-Scope (flagged to caller — do NOT silently expand)

1. **`docs/USAGE.md` drift:** Lines 654, 663, 665 duplicate the OLD token values `#F2F0E8` and `#FDFCF8` (prose + Backgrounds table). The front-end spec §8 does **not** list `docs/USAGE.md` as a file to update. Leaving it creates drift; updating it expands scope beyond the spec.
   - **Plan decision:** Out-of-scope for Task 1. **Caller must decide** whether to authorize a USAGE.md sync patch (recommended, since USAGE.md calls brief.md "authoritative" but still hard-copies values). If approved, mirror the same `#E6DDC6` / `#FBF7ED` edits on USAGE.md lines 654, 663, 665 only.
2. **`CHANGELOG.md`:** Line 46 is a **historical** `[0.10.0]` entry that records the OLD values as the prior state. **Do NOT edit historical changelog entries.** A new `[0.11.0]` changelog entry for this refinement is appropriate but **not required by the spec** for Task 1 (Step 4.4 / docs step may add it). Marked optional.
3. **`--cba-active` button-state collision (spec §1, §6, §9):** The spec notes that if the Shell maps a secondary button's normal **and** active/pressed states to `--cba-bg-elevated`, the token change alone makes the normal state visible against the panel but does **not** fix a normal↔active collision (both would use the same token). This is a Shell/component-state concern for a **follow-up task**, not Task 1. The plan adds a **guidance line** to `docs/CONSUMER_GUIDE.md` (spec §8 requires this) but does **not** introduce a new active-state token.

---

## 3. Files to Modify (authoritative list — spec §8)

| # | File | Type of change |
|---|------|----------------|
| 1 | `src/theme/_variables.scss` | Token values (2) + header comment L* gaps + spec pointer |
| 2 | `.agent/project-info/brief.md` | §5 prose note + 2 token values in the `:root` block |
| 3 | `docs/THEME.md` | Surface-hierarchy descriptors ("clean cream"/"warm near-white") |
| 4 | `docs/CONSUMER_GUIDE.md` | Add secondary-button visibility guideline (no values) |
| 5 | `docs/theme-preview.html` | `--panel`/`--elevated` in `.preview` + `themes` object + hint/comment text |

**Files explicitly NOT touched:** `docs/USAGE.md` (see §2.1), `CHANGELOG.md` historical entries (see §2.2), `src/theme/_utilities.scss`, `src/theme/_mixins.scss`, `src/theme/theme.scss`, any component `.ts`/`.scss`, any `src/components/**`.

---

## 4. Detailed, Atomic Implementation Steps

> **Tooling note (for the implementer in 4.2):** Prefer `vscode-mcp-server_replace_lines_code` or `vscode-mcp-server_create_file_code` for edits; fall back to `edit`. Line numbers are 1-based and reflect the **current** file state (verified during 4.1b). Re-read each target line immediately before editing in case prior steps shifted numbering (edits here are independent files except `brief.md` lines within the same file, so order within a file matters).

### Step 4.1 — `src/theme/_variables.scss` (source of truth)

**4.1a. Update header comment block (lines 5–13) — documents the four-level L* gaps + spec pointer.**

Old (lines 5–13):
```
 * SOURCE OF TRUTH: .agent/project-info/brief.md §5
 * FRONT-END SPEC:  .kilo/plans/20260805-phase9-frontend-spec.md
 *
 * Theme name: Minimal Yet Warm — warm sand / cream / taupe + controlled coral.
 * Canvas is a darker warm sand (C5BFAE) that reads as the "floor"; panels are a
 * clean cream (F2F0E8) so modules read as cards; elevated surfaces are a warm
 * near-white (FDFCF8) for module headers / dropdowns; insets use warm sand
 * (D8C3A5) for table headers / input wells / module footers. Four obviously
 * distinct surfaces: canvas → panel step ≈ 17 L*, panel → elevated ≈ 4 L*,
 * inset sits ≈ 15 L* below panel.
```

New (lines 5–13):
```
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
```

- Front-end-spec pointer (line 6) updated to the Task 1 spec (traceability; recommended).
- Hex descriptors (lines 9–10) updated to `E6DDC6` / `FBF7ED`.
- L* gaps (line 12–13) updated: 17→11, 4→9, 15→8; added elevated→inset ≈17 note.
- **Do NOT touch line 28** (`(#FDFCF8) on dark accents/overlays`) — that documents `--cba-text-inverse`, which is unchanged.

**4.1b. Update token values.**

- Line 58: `  --cba-bg-secondary: #F2F0E8;`  →  `  --cba-bg-secondary: #E6DDC6;`
- Line 60: `  --cba-bg-elevated: #FDFCF8;`  →  `  --cba-bg-elevated: #FBF7ED;`
- Lines 67 (`--cba-text-inverse: #FDFCF8;`), 57 (`--cba-bg-primary`), 59 (`--cba-bg-tertiary`), 70–79 (borders/accents) — **unchanged.**

---

### Step 4.2 — `.agent/project-info/brief.md` (§5 prose + token block)

**4.2a. Update the §5 Note prose (line 101).**

Old:
```
> **Note:** The palette is **Minimal Yet Warm** (warm sand/cream/taupe + controlled coral). Canvas `#C5BFAE` (warm sand floor), panel `#F2F0E8` (clean cream), elevated `#FDFCF8` (warm near-white), inset `#D8C3A5` (warm sand). Canvas → panel step ≈ 17 L\*, panel → elevated ≈ 4 L\*, inset sits ≈ 15 L\* below panel. Coral (`#E98074` soft, `#E85A4F` strong) is reserved for accent/status/focus — NOT for primary CTAs or large fills. Primary/secondary text pass WCAG AA on every intended surface. Muted text is RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) AND on `--cba-bg-tertiary` (inset sand, ~3.86:1) — use `--cba-text-secondary` on those surfaces.
```

New:
```
> **Note:** The palette is **Minimal Yet Warm** (warm sand/cream/taupe + controlled coral). Canvas `#C5BFAE` (warm sand floor), panel `#E6DDC6` (warm cream), elevated `#FBF7ED` (warm cream, lightest surface), inset `#D8C3A5` (warm sand). Canvas → panel step ≈ 11 L\*, panel → elevated ≈ 9 L\*, inset sits ≈ 8 L\* below panel. Coral (`#E98074` soft, `#E85A4F` strong) is reserved for accent/status/focus — NOT for primary CTAs or large fills. Primary/secondary text pass WCAG AA on every intended surface. Muted text is RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) AND on `--cba-bg-tertiary` (inset sand, ~3.86:1) — use `--cba-text-secondary` on those surfaces.
```

**4.2b. Update token values in the `:root` block.**

- Line 107: `  --cba-bg-secondary: #F2F0E8;`  →  `  --cba-bg-secondary: #E6DDC6;`
- Line 109: `  --cba-bg-elevated: #FDFCF8;`  →  `  --cba-bg-elevated: #FBF7ED;`
- Line 116 (`--cba-text-inverse: #FDFCF8;`) — **unchanged** (per spec §3).
- The muted-restriction paragraph at line 160 — **unchanged**; spec §8 explicitly keeps it (still valid: muted passes AA on new panel/elevated; restricted on canvas/inset).

---

### Step 4.3 — `docs/THEME.md` (surface-hierarchy descriptors)

**4.3a. Update the "Surface hierarchy" paragraph (lines 48–53).**

Old (lines 48–53):
```
Minimal Yet Warm is a **four-level surface system**: canvas (`--cba-bg-primary`,
darker warm sand; workspace floor) → panel (`--cba-bg-secondary`, clean cream; module
body) → elevated (`--cba-bg-elevated`, warm near-white; module header / dropdowns) →
inset (`--cba-bg-tertiary`, warm sand; table headers / wells). The hierarchy only
survives in the running Shell if **each surface is painted by its owner** (Shell / Lib /
MFE). See the [Consumer Guide](CONSUMER_GUIDE.md) for the surface ownership map and the
Shell/MFE checklists.
```

New (lines 48–53):
```
Minimal Yet Warm is a **four-level surface system**: canvas (`--cba-bg-primary`,
darker warm sand; workspace floor) → panel (`--cba-bg-secondary`, warm cream; module
body) → elevated (`--cba-bg-elevated`, warm cream, lightest surface; module header /
dropdowns) → inset (`--cba-bg-tertiary`, warm sand; table headers / wells). Panel→elevated
is now the clearest step in the stack. The hierarchy only survives in the running Shell if
**each surface is painted by its owner** (Shell / Lib / MFE). See the [Consumer Guide](CONSUMER_GUIDE.md)
for the surface ownership map and the Shell/MFE checklists.
```

- "clean cream" → "warm cream" (panel); "warm near-white" → "warm cream, lightest surface" (elevated).
- Added one non-numeric clause ("Panel→elevated is now the clearest step in the stack.") — no hex per THEME.md's no-duplicate-values rule.

---

### Step 4.4 — `docs/CONSUMER_GUIDE.md` (add secondary-button visibility guideline — no values)

**4.4a. Add an anti-pattern bullet** (after line 103, inside the `## Anti-patterns` list).

Insert new bullet:
```
- Secondary buttons (`--cba-bg-elevated`) that collapse visually into their panel container
  or into their own active/pressed state — the elevated/panel L* separation must stay
  visible and the active state must use a distinct token/overlay.
```

**4.4b. Add a Quick-verify item** (after line 114, i.e. after item 5 of the `## Quick verify` numbered list).

Insert as item 6:
```
6. Secondary buttons are visibly distinct from the panel they sit on AND from their own
   active/pressed state.
```

- No hex values introduced (honors the guide's "never re-declares hex" rule). Token names only.

---

### Step 4.5 — `docs/theme-preview.html` (mirror tokens + adjust hint text)

**4.5a. Update `.preview` CSS custom properties (line 45).**

Old:
```
      --canvas:#C5BFAE;--panel:#F2F0E8;--elevated:#FDFCF8;--inset:#D8C3A5;
```
New:
```
      --canvas:#C5BFAE;--panel:#E6DDC6;--elevated:#FBF7ED;--inset:#D8C3A5;
```

- Line 48 (`--on-accent:#FDFCF8;`) — **unchanged** (mirrors `--cba-text-inverse`, unchanged).

**4.5b. Update the `themes` object token values (lines 178–179).**

Old:
```
      '--panel':'#F2F0E8',
      '--elevated':'#FDFCF8',
```
New:
```
      '--panel':'#E6DDC6',
      '--elevated':'#FBF7ED',
```

- Line 193 (`'--on-accent':'#FDFCF8'`) — **unchanged**.
- Line 175 (`source` hex array) — **unchanged** (spec §8 does not require it; current array lists canvas/inset/border-strong/warning/danger swatches, none of which changed).

**4.5c. Update the visible hint text (line 101).**

Old:
```
      <p class="hint">Palette preview for @cobranza-apps/ui — Minimal Yet Warm (Phase 9 surface hierarchy). Canvas ≠ panel ≠ elevated ≠ inset, coral reserved for accents.</p>
```
New:
```
      <p class="hint">Palette preview for @cobranza-apps/ui — Minimal Yet Warm (refined 2026-08-06: panel darkened to warm cream, elevated given a cream tint; panel→elevated gap widened). Canvas ≠ panel ≠ elevated ≠ inset, coral reserved for accents.</p>
```

**4.5d. Update the top HTML comment (line 4) — mention the adjustment.**

Old:
```
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui (Phase 9 — Minimal Yet Warm surface hierarchy).
```
New:
```
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui (Phase 9 — Minimal Yet Warm surface hierarchy; refined 2026-08-06: panel/elevated tokens adjusted).
```

- This satisfies spec §8: "Also update the page comment/hint text to mention the token adjustment."

---

## 5. Verification (Must Pass)

Run each command separately (no chaining) from the project root (`C:\projects\cobranza-app\front\ui`). These are the gates; do NOT mark the task done until both pass.

1. **Build (compiles SCSS; validates `_variables.scss`):**
   - Command: `npm run build`
   - Expected: `ng-packagr -p ng-package.json -c tsconfig.lib.json` succeeds; `dist/` produced; no SCSS errors.

2. **Lint (TypeScript sources unaffected, but confirms no regressions):**
   - Command: `npm run lint`
   - Expected: `eslint "src/**/*.ts"` passes with no new violations.

3. **(Optional sanity, no test changes in scope):**
   - Command: `npm test`
   - Expected: existing Jest suite still green (no token tests exist yet — Task 4 adds them).

4. **(Manual / human) Visual preview check** — open `docs/theme-preview.html` in a browser and confirm:
   - canvas ≠ panel ≠ elevated ≠ inset at a glance;
   - the secondary button (`.btn-secondary`, uses `--elevated`) is visibly distinct from the panel module surface it sits on;
   - coral only on accents/status.

---

## 6. Git Commits (executed by implementer in 4.2; meaningful, atomic)

> Branch already exists: `feat/theme-refinement-tokens-preview-guide`. Version already bumped to `0.11.0`. Before committing, follow the [Gitignore Compliance Rule](../.kilo/rules/gitignore-compliance.md): read `.gitignore`, run `git status`, ensure no `node_modules/` / `dist/` / ignored files are staged.

Recommended two commits:

**Commit A — source of truth:**
- Stage: `src/theme/_variables.scss`
- Message:
  ```
  refactor(theme): adjust panel/elevated tokens to widen surface gap

  --cba-bg-secondary: #F2F0E8 -> #E6DDC6 (darker, warmer cream; L* 94.8 -> 88.3)
  --cba-bg-elevated:  #FDFCF8 -> #FBF7ED (cream tint, still lightest; L* 98.9 -> 97.3)
  Panel->elevated L* gap: ~4.2 -> ~9.0. Header comment + spec pointer updated.
  Canvas, inset, text, accent, border tokens unchanged.

  Refs: .kilo/plans/20260806-task1-token-adjustments-frontend-spec.md
  ```

**Commit B — docs + preview sync:**
- Stage: `.agent/project-info/brief.md`, `docs/THEME.md`, `docs/CONSUMER_GUIDE.md`, `docs/theme-preview.html`
- Message:
  ```
  docs: sync theme docs & preview to adjusted panel/elevated tokens

  brief.md  §5:    panel #E6DDC6, elevated #FBF7ED; L* gaps 11/9/8.
  THEME.md:        surface descriptors (warm cream, lightest).
  CONSUMER_GUIDE:  add secondary-button visibility guideline (no values).
  theme-preview:   mirror --panel/--elevated; note 2026-08-06 refinement.
  ```

- Push is **not** part of this step (Step 5 merges to `main` and pushes to `origin` only). Per [Git Remote Safety Rule](../.kilo/rules/git-remote-safety.md), never push to remotes other than `origin`.

---

## 7. Constraints Reaffirmed (from task prompt + spec)

- Canvas (`#C5BFAE`) and inset (`#D8C3A5`) **unchanged** — spec §2 locks them.
- No `--cba-*` token is renamed.
- No text or accent token value changes (`--cba-text-inverse` stays `#FDFCF8`).
- Header comment in `_variables.scss` documents the new four-level L* gaps (Step 4.1a).
- `--on-accent` in `docs/theme-preview.html` stays `#FDFCF8` (mirrors `--cba-text-inverse`, unchanged) — do **not** change to `#FBF7ED`.
- No hard-coded color values added in components; only token values changed (no component files touched).

---

## 8. Verification Checklist (mirrors front-end spec §10)

- [ ] `src/theme/_variables.scss` contains `--cba-bg-secondary: #E6DDC6` and `--cba-bg-elevated: #FBF7ED`.
- [ ] No `--cba-*` token was renamed.
- [ ] Canvas (`#C5BFAE`) and inset (`#D8C3A5`) values are unchanged.
- [ ] Panel→elevated L* gap is ≥ 8 L* (achieved: ~9 L*).
- [ ] All four surfaces distinguishable at a glance in the preview.
- [ ] `--cba-text-primary`, `--cba-text-secondary`, `--cba-text-muted` all pass WCAG AA 4.5:1 on both new panel and new elevated (per spec §5; muted=4.88:1 lowest).
- [ ] `--cba-text-inverse` (`#FDFCF8`) still passes AA on `--cba-accent-primary` (6.32:1, unchanged).
- [ ] `docs/theme-preview.html` mirrors new `--panel`/`--elevated`; `--on-accent` unchanged.
- [ ] `.agent/project-info/brief.md` §5 prose and token table synchronized; muted-restriction note preserved.
- [ ] `docs/THEME.md` descriptors updated; `docs/CONSUMER_GUIDE.md` secondary-button guideline added (no hex).
- [ ] No coral introduced as a large surface fill; no component hard-codes.
- [ ] `npm run build` and `npm run lint` pass.

---

## 9. What This Plan Does NOT Do (boundaries)

- Does **not** write code or modify non-`.md` files (Architector step = plan only).
- Does **not** run git commands (commit/push belongs to implementer in 4.2 and Step 5).
- Does **not** touch `docs/USAGE.md` (out-of-scope; flagged in §2.1 for caller).
- Does **not** edit historical `CHANGELOG.md` entries; does **not** add a new changelog entry (optional, caller).
- Does **not** introduce an `--cba-active`/active-state token (Shell/component follow-up; spec §6, §9).
- Does **not** add regression tests (Task 4).
- Does **not** change preview `source` hex array or any `--cba-*` other than the two named tokens.

---

## 10. Plan-vs-Spec Cross-Check

| Spec §8 row | Covered by | Match |
|-------------|-----------|-------|
| `src/theme/_variables.scss` — 2 token values + header comment L* gaps | Step 4.1 | Yes |
| `.agent/project-info/brief.md` §5 — 2 token values + prose (L* gaps + restriction note kept) | Step 4.2 | Yes |
| `docs/theme-preview.html` — `--panel`/`--elevated` in `.preview` + `themes` object + comment/hint text | Steps 4.5a–4.5d | Yes |
| `docs/CONSUMER_GUIDE.md` — secondary-button visibility line (no value change) | Steps 4.4a–4.4b | Yes |
| `docs/THEME.md` — surface hierarchy prose descriptors | Step 4.3 | Yes |

All five authoritative files covered. No token renamed. Canvas/inset/text/accent untouched. `--on-accent` preserved. Header comment L* gaps updated. Plan aligns with TODO lines 2–3 and the front-end spec. **No rework needed.**

---

**End of plan. Path:** `.kilo/plans/20260806-task1-token-adjustments.md`