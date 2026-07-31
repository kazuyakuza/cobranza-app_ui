# Task 3 — Code Simplification Plan

## Goal
Reduce documentation duplication, verbosity, and inconsistency introduced by the Task 3 documentation changes without changing component contracts or code behavior.

## Findings

### 1. README.md duplication
**Problem:** `README.md` overlaps heavily with `docs/USAGE.md` and `docs/THEME.md`.
- **Installation** section mirrors `docs/USAGE.md#Installation` and `docs/USAGE.md#Peer Dependencies`.
- **Quick Start** section mirrors `docs/USAGE.md#Quick Start`.
- **Development Commands** table mirrors `docs/USAGE.md#Development Setup`.
- **Component Inventory** table is a condensed version of the per-component sections in `docs/USAGE.md#Component Usage Patterns`.
- **Design Tokens (Theme)** section mirrors `docs/THEME.md` and `.agent/project-info/brief.md §5`.
- **Spanish-only UI defaults** section duplicates the note in `docs/USAGE.md#Quick Start > Spanish-only defaults`.
- **Documentation** section is a long explicit list of every doc file; it could be categorized by the groups already used in `docs/INDEX.md`.

**Impact:** Consumers and AI agents have to read the same content in two places; README bloat undermines its role as a quick entry point.

### 2. README.md verbosity
**Problem:** The README is large and contains details that are better left to the dedicated docs.
- The peer-dependency table repeats version ranges already declared in `package.json`.
- The `Config files reference` table duplicates file explanations already present in `docs/USAGE.md` and `docs/INDEX.md`.
- The **What this library provides / is NOT** lists are useful but could be tightened to a single sentence each, linking to the detailed non-goals in `docs/USAGE.md` or `brief.md`.

### 3. USAGE.md duplication
**Problem:** `docs/USAGE.md` duplicates entry-level content from `README.md`.
- **Development Setup**, **Installation**, **Peer Dependencies**, and **Theme Import** are also covered in `README.md`.
- **Quick Start** examples overlap with `README.md#Quick Start`.
- **Design Tokens Reference** duplicates `README.md#Design Tokens (Theme)` and `docs/THEME.md`.

**Impact:** The file is large and hard to scan; it should focus on *usage patterns* rather than setup instructions.

### 4. Component doc section inconsistency
**Problem:** Non-goals / ownership disclaimers are not named consistently across component docs.
- `docs/CBA_MODAL.md` and `docs/CBA_INPUT.md` use `## Non-goals`.
- `docs/CBA_DATEPICKER.md` uses `## Non-goals`.
- `docs/CBA_SELECT.md` uses `## Non-goals`.
- `docs/CBA_BUTTON.md` uses `## Non-goals`.
- `docs/CBA_TYPEAHEAD.md` and `docs/CBA_POPOVER.md` and `docs/CBA_DROPDOWN.md` use `## Important notes` (and no `## Non-goals`).
- `docs/CBA_ACCORDION.md` uses `## Important non-goals`.

**Impact:** Harder for AI agents to parse the same conceptual section across files.

### 5. Repeated form-field wrapper disclaimers
**Problem:** `docs/CBA_INPUT.md`, `docs/CBA_SELECT.md`, and `docs/CBA_DATEPICKER.md` each contain near-identical sentences:
- "`label`, `hint`, `error`, and `disabled` are inherited from `CbaFieldControlValueAccessor`. See `CBA_FORM_FIELD.md` for the shared conventions."
- Nearly identical "Forms integration" sub-sections (template-driven, reactive, disabled).
- Very similar "Theming" tables describing the same parent `CbaFieldComponent` wrapper.

**Impact:** Maintenance burden when the shared field contract changes; readers encounter the same table three times.

### 6. Theming notes verbosity
**Problem:** Several component docs include long, table-based theming notes that repeat the same tokens.
- `docs/CBA_INPUT.md`, `docs/CBA_SELECT.md`, `docs/CBA_DATEPICKER.md` share the same control-background/border/focus tokens.
- `docs/CBA_TYPEAHEAD.md` theming notes repeat input tokens and popup tokens already described in `docs/THEME.md`.
- `docs/CBA_POPOVER.md` and `docs/CBA_DROPDOWN.md` and `docs/CBA_MODAL.md` describe nearly identical elevated surfaces (`--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-elevated`).

**Impact:** Verbose without adding per-component value; a short reference to the global theme tokens is sufficient.

### 7. `docs/CBA_MODULE_FOOTER.md` examples
**Problem:** Four usage examples cover very similar cases (status, statusText override, projected content, plain bar). These could be reduced to two or three combined examples.

**Impact:** Larger file than necessary; a single example showing status + projected content + `statusText` override would be clearer.

### 8. README "Documentation" link list
**Problem:** The README `Documentation` section lists every file individually. `docs/INDEX.md` already exists and groups the same files.

**Impact:** The README list is redundant and must be updated manually when files are added.

### 9. `docs/CBA_TYPEAHEAD.md` length
**Problem:** The file is substantially longer than the other component docs because it includes a large `searchStates` example with a full `US_STATES` array stub, plus multiple sub-sections.

**Impact:** Harder to scan; the local-search example could be shortened by removing the placeholder array and relying on a small inline list.

### 10. Overlapping introductory language
**Problem:** Many ng-bootstrap wrapper docs start with the same pattern:
- "Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` ..."
- "ng-bootstrap owns X, Y, Z; `CbaComponent` only adds theming and a stable API."

While this is intentional, a short shared phrase in `docs/USAGE.md` or a single note could reduce repetition without losing clarity.

## Proposed Simplifications

### S1. README.md — become a true entry point
- **Keep** (shortened): Overview, Target Consumers, Installation one-liner, Quick Start minimal example, Component Inventory short table, Documentation links, Contributing, License.
- **Move to USAGE.md** (or rely on existing content): Detailed installation instructions, peer dependency table, development commands, config files reference, full quick-start examples, full design tokens reference.
- **Replace** the long `Documentation` list with a short pointer to `docs/INDEX.md` and a small curated list of the most common docs (USAGE, THEME, MODULE_HEADER, MODULE_CONTAINER).
- **Merge** the `Spanish-only UI defaults` note into one paragraph that links to `docs/USAGE.md` for the component-level examples.
- **Tighten** the "What this library provides / is NOT" bullets to a maximum of 5 items each, linking to `brief.md` for full scope.

### S2. USAGE.md — focus on usage patterns
- **Remove** the `Development Setup` section entirely (or reduce to a one-line link to `README.md#Development Commands`).
- **Remove** the `Peer Dependencies` table and command (or keep one short paragraph and link to `README.md#Installation`).
- **Shorten** `Theme Import` to a single example plus a link to `docs/THEME.md`.
- **Remove** or collapse the `Design Tokens Reference` section, pointing to `docs/THEME.md` and `brief.md §5`.
- **Keep** the `Component Usage Patterns` section as the primary content; it is the unique value of this file.
- **Consolidate** the repeated `label`/`hint`/`error`/`disabled` intro paragraphs in CbaInput/CbaSelect/CbaDatepicker sub-sections into one shared sentence that references `CBA_FORM_FIELD.md`.

### S3. Standardize component doc non-goals / ownership sections
- **Rename** all sections that describe ownership boundaries to `## Non-goals`.
- In `docs/CBA_TYPEAHEAD.md`, `docs/CBA_POPOVER.md`, and `docs/CBA_DROPDOWN.md`, rename `## Important notes` to `## Non-goals` and move the ownership disclaimers there.
- Keep only truly technical "important notes" (e.g., `container="body"`, `hostDirectives` wiring) in a short `## Implementation notes` or inline within the relevant section.
- In `docs/CBA_ACCORDION.md`, rename `## Important non-goals` to `## Non-goals`.

### S4. Centralize shared form-field content
- **Extract** the common "Theming" table for `CbaInput`, `CbaSelect`, `CbaDatepicker` into `docs/CBA_FORM_FIELD.md` (it already exists for the shared label/hint/error conventions).
- In each of the three component docs, **replace** the long theming table with a short sentence: "Theming follows the shared `CbaFieldComponent` conventions; see `CBA_FORM_FIELD.md#Theming` for the full token table."
- In each form-control doc, **shorten** the `Forms integration` section to one example (template-driven) and a link to `CBA_FORM_FIELD.md` for reactive forms and disabled-state details, or keep the three examples but move them to `CBA_FORM_FIELD.md` and link to them.

### S5. Shorten wrapper introductory text
- In each ng-bootstrap wrapper doc (Modal, Dropdown, Popover, Typeahead, Accordion, Datepicker), replace the long opening sentence that lists every ng-bootstrap behavior with a shorter variant:
  - "Thin wrapper around `@ng-bootstrap/ng-bootstrap` `<X>` that applies the Cobranza theme and exposes a stable selector. All behavior (open, close, keyboard, positioning) comes from ng-bootstrap; see its docs for details."
- Remove the repeated "Requires Bootstrap 5 CSS" sentence from individual docs; it belongs in the README / USAGE installation section once.

### S6. Consolidate common theming notes across wrapper docs
- Create a short, reusable note in `docs/USAGE.md` or `docs/THEME.md` such as: "Elevated surfaces (dropdowns, popovers, modals, typeahead popups) use the `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-elevated` tokens."
- In each wrapper doc, replace the verbose theming table with that reference plus any component-specific modifier classes.

### S7. Reduce `docs/CBA_MODULE_FOOTER.md` examples
- Combine the four examples into two:
  1. "Footer with default status and projected content" (covers status + default text + projection).
  2. "Footer with statusText override and no status" (covers override + plain bar).
- Remove the separate "Footer with status and default text" and "Footer with no status" examples.

### S8. Shorten `docs/CBA_TYPEAHEAD.md` local-search example
- Replace the `US_STATES` placeholder array with a tiny inline list (`['Alabama', 'Alaska', 'Arizona']`) so the example is self-contained but not lengthy.
- Remove the "With label, hint, error" section if it duplicates the same content shown in `CBA_INPUT.md` and `CBA_FORM_FIELD.md`.

### S9. Remove duplicate README / USAGE quick-start
- Keep the README quick start as the minimal workspace example (ModuleContainer + ModuleHeader).
- Keep the USAGE quick start as the more detailed Shell + MFE examples.
- Remove the README quick-start paragraph that says "For usage patterns and examples, see `/docs/USAGE.md`." because the README already has a Quick Start section; or make it explicit that README is the minimal example and USAGE is the full patterns guide.

### S10. Consolidate cross-references
- In every component doc, Related docs should link to the same canonical set with consistent paths (all `./FILE.md` or all `/docs/FILE.md`).
- Currently some links use `/docs/...` and some use `./...` within the same file. Standardize on `./FILE.md` for component docs and `../README.md` / `../.agent/...` for project-level files.

## Simplification priority

1. **High** — S1 (README entry point), S2 (USAGE focus), S3 (standardize non-goals), S4 (form-field table).
2. **Medium** — S5 (shorten openings), S7 (footer examples), S8 (typeahead example), S10 (link paths).
3. **Low** — S6 (elevated-surface note), S9 (quick-start wording) can be deferred if time is limited.

## Non-goals (do NOT change)
- Component API contracts (inputs/outputs/selectors).
- Code implementation or JSDoc.
- `.agent/project-structure.md` content.
- `docs/INDEX.md` structure (it is already concise and well-organized).
- `docs/THEME.md` (assumed unchanged; only referenced more).

## Files affected
- `README.md`
- `docs/USAGE.md`
- `docs/CBA_MODAL.md`
- `docs/CBA_DATEPICKER.md`
- `docs/CBA_INPUT.md`
- `docs/CBA_SELECT.md`
- `docs/CBA_TYPEAHEAD.md`
- `docs/CBA_POPOVER.md`
- `docs/CBA_DROPDOWN.md`
- `docs/CBA_ACCORDION.md`
- `docs/CBA_MODULE_FOOTER.md`
- `docs/CBA_FORM_FIELD.md` (potential centralization target)

## Outcome
After these simplifications, the docs should be shorter, have a single source of truth for each topic, and use consistent heading conventions and link paths, while preserving all functional information.
