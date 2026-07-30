import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

/** Width variant supported by {@link CbaModalComponent} and {@link CbaModalService}. */
export type CbaModalSize = 'sm' | 'md' | 'lg';

/**
 * Reason values that may be returned when a `CbaModal` is dismissed.
 *
 * This is a consumer-facing type; CbaModalService does not emit it directly.
 * Components use it in type annotations when reading `NgbModalRef.dismissed`.
 */
export type CbaModalDismissReason = 'backdrop' | 'escape' | 'close' | string;

/**
 * Options for {@link CbaModalService.open}.
 *
 * Thin layer over `NgbModalOptions`. The wrapper-specific keys
 * (`size`, `centered`, `dismissible`) are translated by the service into the
 * corresponding ng-bootstrap keys. Every other `NgbModalOptions` key picked
 * here is forwarded untouched.
 */
export interface CbaModalOptions extends Pick<
  NgbModalOptions,
  | 'ariaLabelledBy'
  | 'ariaDescribedBy'
  | 'windowClass'
  | 'modalDialogClass'
  | 'backdropClass'
  | 'scrollable'
  | 'beforeDismiss'
> {
  /** Width variant forwarded to ng-bootstrap `size`. */
  size?: CbaModalSize;

  /** Vertically center the dialog (ng-bootstrap `centered`). */
  centered?: boolean;

  /**
   * Allow backdrop click and ESC to dismiss.
   * `false` -> ng-bootstrap `backdrop: 'static'` + `keyboard: false`.
   * Defaults to `true` when omitted.
   */
  dismissible?: boolean;
}
