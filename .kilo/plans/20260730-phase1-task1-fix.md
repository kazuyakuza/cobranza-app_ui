# Fix Plan — Phase 1, Task 1: Design Tokens (`_variables.scss`)

## Review Findings

One deviation was found in `src/lib/theme/_variables.scss`.

### Issue 1: `--cba-active` alpha value does not match source of truth

- **Location:** `src/lib/theme/_variables.scss`, line 30 (inside `/* Interactive states */` group)
- **Current value:** `rgba(255, 255, 255, 0.1)`
- **Expected value:** `rgba(255, 255, 255, 0.10)`
- **Source of truth:** `.agent/project-info/brief.md` §5 Design Tokens and `.kilo/plans/20260730-phase1-task1-plan.md` Step 1.2.
- **Impact:** CSS renders identically (`0.1` and `0.10` are equivalent), but the implementation plan explicitly decided to keep `0.10` verbatim to avoid any diff against the brief/spec. The current file deviates from that decision.
- **Severity:** Minor (quality/consistency).

### Verification Summary

| Check | Result |
| --- | --- |
| Token count (`--cba-` declarations) | 35 (expected 35) |
| All tokens under `:root` | Yes |
| All tokens prefixed with `--cba-` | Yes |
| No placeholder comment | Yes (`Placeholder` not found) |
| Token names match brief.md §5 | Yes |
| Values match brief.md §5 | No — `--cba-active` alpha is `0.1` instead of `0.10` |
| No component styles / utility classes / mixins | Yes |

## Fix Steps

1. Open `src/lib/theme/_variables.scss`.
2. Change line 30 from:
   ```scss
   --cba-active: rgba(255, 255, 255, 0.1);
   ```
   to:
   ```scss
   --cba-active: rgba(255, 255, 255, 0.10);
   ```
3. Re-run the verification commands from the implementation plan:
   - Confirm token count is still 35.
   - Confirm `Placeholder` is not present.
   - Confirm `:root` selector is present.
   - Confirm all tokens still use the `--cba-` prefix.
4. Run Prettier if it changes formatting:
   ```powershell
   npx prettier --write "src/lib/theme/_variables.scss"
   ```
5. Verify the file again after formatting to ensure Prettier did not revert `0.10` to `0.1`.
6. No build re-run is strictly required because this is a numeric literal change with no structural impact, but running `npm run build` is acceptable if the implementer wants extra confidence.
7. Stage and commit the fix with a meaningful message.

## Files to Modify

| File | Change |
| --- | --- |
| `src/lib/theme/_variables.scss` | Change `--cba-active` alpha from `0.1` to `0.10`. |

## Out of Scope

- No other tokens, values, or structure changes.
- No new files.
- No utility classes, mixins, or `theme.scss` wiring (handled in later tasks).
