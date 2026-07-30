# Block B Code-Simplification Suggestions

File reviewed: `src/lib/components/module-container/module-container.component.scss`

## Suggestion 1 — Remove redundant fullscreen override

The `:host(.cba-module-container--fullscreen)` block only resets properties that are not inherited and whose initial values are already the desired ones:

- `border` initial value is `none`
- `border-radius` initial value is `0`
- `box-shadow` initial value is `none`

Because the chrome properties are applied exclusively inside `:host(:not(.cba-module-container--fullscreen))`, the fullscreen override is unnecessary.

**Current**

```scss
:host(:not(.cba-module-container--fullscreen)) {
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
  overflow: hidden;
}

:host(.cba-module-container--fullscreen) {
  border: none;
  border-radius: 0;
  box-shadow: none;
}
```

**Proposed**

```scss
:host(:not(.cba-module-container--fullscreen)) {
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
  overflow: hidden;
}
```

This removes 5 lines and one selector without changing behavior.

## Suggestion 2 — Nest webkit scrollbar selectors under the body block

The webkit scrollbar rules repeat the `.cba-module-container__body` prefix five times. SCSS nesting removes that repetition and keeps the scrollbar styling grouped with the body.

**Current**

```scss
.cba-module-container__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--cba-border-default) transparent;
}

.cba-module-container__body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.cba-module-container__body:hover::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

.cba-module-container__body::-webkit-scrollbar-track {
  background: transparent;
}

.cba-module-container__body::-webkit-scrollbar-thumb {
  background-color: var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
}

.cba-module-container__body:hover::-webkit-scrollbar-thumb {
  background-color: var(--cba-border-strong);
}
```

**Proposed**

```scss
.cba-module-container__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--cba-border-default) transparent;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &:hover::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--cba-border-default);
    border-radius: var(--cba-radius-sm);
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: var(--cba-border-strong);
  }
}
```

This keeps the same output but improves locality and removes repeated selectors.

## Suggestion 3 — Nest reduced-motion media query with the body block

After nesting the scrollbar rules, the reduced-motion override can be nested as well.

**Current**

```scss
@media (prefers-reduced-motion: reduce) {
  .cba-module-container__body:hover::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}
```

**Proposed**

```scss
.cba-module-container__body {
  // ...existing body rules...

  @media (prefers-reduced-motion: reduce) {
    &:hover::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
  }
}
```

## Suggestion 4 — Consolidate scrollbar dimension pairs with CSS custom properties

The width/height pairs are repeated three times (default, hover, reduced-motion). A local custom property removes that repetition and makes the reduced-motion rule shorter.

**Proposed**

```scss
.cba-module-container__body {
  --cba-module-container-scrollbar-size: 6px;

  &:hover {
    --cba-module-container-scrollbar-size: 9px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      --cba-module-container-scrollbar-size: 6px;
    }
  }

  &::-webkit-scrollbar {
    width: var(--cba-module-container-scrollbar-size);
    height: var(--cba-module-container-scrollbar-size);
  }
}
```

This changes the output only by using a square scrollbar (width equals height), which matches the current design where both values are identical. If a non-square scrollbar is ever needed, revert this change.

## Summary

- **Suggestion 1** removes 5 lines and one selector with no behavior change.
- **Suggestion 2** reduces selector repetition via nesting.
- **Suggestion 3** keeps the media query close to the rules it overrides.
- **Suggestion 4** further consolidates the dimension pairs but is optional and should be skipped if a non-square scrollbar is anticipated.

Applying suggestions 1, 2, and 3 together keeps the file behavior identical while improving maintainability.
