import { signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/**
 * Shared `ControlValueAccessor` scaffolding for Cba form controls.
 *
 * Holds the current value as a signal and tracks the disabled flag pushed by
 * Angular forms via `setDisabledState`. Concrete controls extend this class and
 * combine their own `disabled` input with `disabledFromCva()` via a computed
 * `isDisabled`.
 */
export abstract class CbaControlValueAccessor<T> implements ControlValueAccessor {
  /** Current control value, written by Angular forms and updated by user interaction. */
  protected readonly value = signal<T | null>(null);

  /** Disabled flag pushed by Angular forms through `setDisabledState`. */
  protected readonly disabledFromCva = signal(false);

  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCva.set(isDisabled);
  }

  /** Sets the value signal and propagates the change to Angular forms. */
  protected updateValue(value: T | null): void {
    this.value.set(value);
    this.onChange(value);
  }

  /** Marks the control as touched and propagates the touched callback. */
  protected markAsTouched(): void {
    this.onTouched();
  }
}
