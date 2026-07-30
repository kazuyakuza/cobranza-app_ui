/** Inputs describing a CbaField's accessibility state, used to build `aria-describedby`. */
export interface CbaFieldDescribingInputs {
  /** Stable id shared by the native control and `<label for>`. */
  readonly controlId: string;
  /** Optional helper text; when present its id is added to `aria-describedby`. */
  readonly hint?: string | undefined;
  /** Optional error message; when present its id is added to `aria-describedby`. */
  readonly error?: string | undefined;
}

/** Id of the hint element rendered by `CbaFieldComponent`. */
export function fieldHintId(controlId: string): string {
  return `${controlId}-hint`;
}

/** Id of the error element rendered by `CbaFieldComponent`. */
export function fieldErrorId(controlId: string): string {
  return `${controlId}-error`;
}

/**
 * Space-separated `aria-describedby` value listing the hint and/or error element ids
 * that are currently rendered, or `null` when neither is present.
 */
export function describedByFieldIds(input: CbaFieldDescribingInputs): string | null {
  const ids: string[] = [];
  if (input.hint) {
    ids.push(fieldHintId(input.controlId));
  }
  if (input.error) {
    ids.push(fieldErrorId(input.controlId));
  }
  return ids.length > 0 ? ids.join(' ') : null;
}
