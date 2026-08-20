# Plan — Task B: Fix failing tests (module-header)

> TODO: `.agent/todos/20260820/20260820-todo-1.md` → section "Fix failing tests (module-header)"
> Critical Workflow step 4.1b (Analysis & Planning) for Task B.
> Target implementer: JUNIOR developer under 50% restriction.

## 1. Root cause analysis

### 1.1 Template state (source of truth)

`src/components/module-header/module-header.component.html` renders, inside the
`<nav class="cba-module-header__section--actions">` (only when `isFullscreen()` is false),
the following buttons in this exact order:

1. `<ng-content select="[cbaModuleDragHandle]"></ng-content>` — optional projected drag handle (0 or 1 element).
2. **Built-in drag button** — `aria-label="Arrastrar módulo"`, class `cba-module-header__action--drag`, NO `(click)` handler. Does NOT emit any Angular `output()`.
3. Collapse button — `aria-label` is `collapseLabel()` (`"Colapsar módulo"` when expanded, `"Expandir módulo"` when collapsed) → emits `collapseToggle`.
4. Size-toggle button — `aria-label` is `sizeToggleLabel()` (`"Reducir módulo a 50%"` when full, `"Expandir módulo a 100%"` when half) → emits `sizeToggle` with `sizeToggleTarget()`.
5. Fullscreen button — `aria-label="Pantalla completa"` → emits `fullscreenToggle`.
6. Remove button — `aria-label="Quitar módulo"` → emits `remove`.

### 1.2 Why the tests fail

- `setup()` in the first `describe` block uses `TestBed.createComponent(ModuleHeaderComponent)`
  with NO projected drag handle. The nav therefore contains **5 buttons**: built-in drag +
  collapse + size + fullscreen + remove. The test asserts `toHaveLength(4)` → fails (received 5).
- The second `describe` block (`TestHostComponent`) projects a drag handle via
  `[cbaModuleDragHandle]`. The nav contains **6 buttons**: projected drag + built-in drag +
  collapse + size + fullscreen + remove. The test asserts `toHaveLength(5)` → fails (received 6).

### 1.3 ACTION_CASES audit

`ACTION_CASES` (spec lines 12-17) contains exactly the 4 output-emitting buttons
(`collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`). The built-in drag button
intentionally has no `(click)` handler and no `output()`, so it is correctly NOT in
`ACTION_CASES`. **No change to `ACTION_CASES` is required.** The `it.each(ACTION_CASES)`
test uses `queryButton(label)` which queries by `aria-label`; none of the ACTION_CASES
labels collide with `"Arrastrar módulo"`, so adding the built-in drag button to the
template does not break the parameterized emit test.

### 1.4 Collisions note (verified, no action needed)

Both the projected drag handle and the built-in drag button share
`aria-label="Arrastrar módulo"`. In the projection test,
`nav.querySelector('button[aria-label="Arrastrar módulo"]')` returns the **first** match in
DOM order, which is the projected handle (rendered by `ng-content` before the built-in
button). `navButtons[0]` is therefore the projected handle, so the existing assertion
`expect(navButtons[0]).toBe(dragHandle)` remains valid after the count is updated.

## 2. High-level approach

Update two `expect(...).toHaveLength(...)` assertions in
`src/components/module-header/module-header.component.spec.ts` to match the current
template (built-in drag button included). Update the first test's name to reflect the new
count. Do NOT modify `ACTION_CASES`, the component template, the component TS, or any other
file. Then run the test suite to verify zero failures.

## 3. Detailed steps

### Step 1 — Edit `src/components/module-header/module-header.component.spec.ts`

**File:** `C:\projects\cobranza-app\front\ui\src\components\module-header\module-header.component.spec.ts`

#### 1a. Update the "no drag handle projected" test (spec lines 112-116)

Current:
```ts
  it('renders the four built-in action buttons when no drag handle is projected (empty slot)', () => {
    setup();
    const navButtons = fixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons).toHaveLength(4);
  });
```

Replace with:
```ts
  it('renders the five built-in action buttons when no drag handle is projected (empty slot)', () => {
    setup();
    const navButtons = fixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons).toHaveLength(5);
  });
```

Rationale: the nav now contains the built-in drag button plus the 4 action buttons
(collapse, size, fullscreen, remove) = 5 total.

#### 1b. Update the "drag handle projected" test count (spec line 142)

Current (inside the test `'projects the drag handle into the actions nav before the built-in buttons'`):
```ts
    expect(navButtons).toHaveLength(5);
```

Replace with:
```ts
    expect(navButtons).toHaveLength(6);
```

Rationale: projected drag handle + built-in drag button + 4 action buttons = 6 total.
Leave the surrounding assertions (`nav` not null, `dragHandle` not null,
`navButtons[0] === dragHandle`) unchanged — they remain correct (see §1.4).

#### 1c. No change to `ACTION_CASES`

Confirm `ACTION_CASES` (spec lines 12-17) is left untouched. The built-in drag button
does not emit an `OutputEmitterRef`, so it must NOT be added to `ACTION_CASES`. No new
test is required for the built-in drag button's click behavior because it intentionally
has no click handler (drag-and-drop is owned by the Shell, per the component JSDoc).

### Step 2 — Run the test suite

**Console command (single cmd, run in project root `C:\projects\cobranza-app\front\ui`):**

```
npm run test
```

**Expected result:** all tests in `module-header.component.spec.ts` pass, and the overall
suite has zero failures.

**If a different count is reported:** STOP and return a question to the caller with the
actual received count and the full test failure output. Do NOT adjust the expectations
again without confirming against the real DOM.

### Step 3 — Run lint and build:lib (verification, no fixes outside scope)

**Console commands (run each separately, single cmd each):**

```
npm run lint
```

```
npm run build:lib
```

**Expected result:** both pass with zero errors. These commands are verification-only for
this task's scope (test file edit only); they should not be affected. If either fails with
errors pointing to the edited spec file, fix the reported spec-file issue only. If errors
point to unrelated files, STOP and return a question to the caller.

### Step 4 — Commit

**Console commands (run each separately):**

```
git status
```

Review output. Only `src/components/module-header/module-header.component.spec.ts` should
appear as modified. If other files appear, STOP and return a question to the caller.

```
git add src/components/module-header/module-header.component.spec.ts
```

```
git commit -m "test(module-header): update button counts for built-in drag button"
```

**Do NOT push.** Push is restricted to Critical Workflow step 5.

### Step 5 — Report back

Return a summary to the caller containing:
- The two edited line ranges (old → new `toHaveLength` values: 4 → 5 and 5 → 6).
- Confirmation that `ACTION_CASES` was NOT modified.
- `npm run test` final result (pass/fail counts).
- `npm run lint` and `npm run build:lib` final results.
- Commit hash (from `git log -1 --format=%H`).

## 4. Files touched

| File | Change |
|------|--------|
| `src/components/module-header/module-header.component.spec.ts` | 2 assertions updated (line ~115: 4→5; line ~142: 5→6) + 1 test name update (line ~112). |

## 5. Files NOT touched (out of scope)

- `src/components/module-header/module-header.component.html`
- `src/components/module-header/module-header.component.ts`
- `src/components/module-header/module-header.component.scss`
- `src/i18n/ui-messages.ts`
- `ACTION_CASES` constant (no emit case added for the built-in drag button)
- Any other TODO section (those are separate tasks with their own 4.1–4.6 cycles)
- `CHANGELOG.md`, `package.json` version (handled by other Critical Workflow steps)

## 6. Acceptance for this plan

- `npm run test` passes with zero failures.
- Only the spec file is modified and committed.
- `ACTION_CASES` unchanged.
- No push performed.
