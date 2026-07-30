import { Injectable, TemplateRef, Type, inject } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CbaModalOptions } from './cba-modal.types';

/**
 * Thin convenience wrapper around {@link NgbModal.open}.
 *
 * Translates {@link CbaModalOptions} into `NgbModalOptions` and delegates to
 * ng-bootstrap. Open/close, backdrop, ESC and focus management are owned by
 * ng-bootstrap. Returns the raw {@link NgbModalRef} so consumers can read
 * `closed` / `dismissed` and call `close()` / `dismiss()`.
 *
 * @see [CBA_MODAL.md](/docs/CBA_MODAL.md)
 */
@Injectable({ providedIn: 'root' })
export class CbaModalService {
  private readonly ngbModal = inject(NgbModal);

  /**
   * Open `content` (component type or `TemplateRef`) as a themed modal.
   * @param content Component type or `TemplateRef` to render as modal content.
   * @param options Wrapper options; forwarded/translated to ng-bootstrap.
   */
  open(content: Type<unknown> | TemplateRef<unknown>, options?: CbaModalOptions): NgbModalRef {
    return this.ngbModal.open(content, this.toNgbOptions(options));
  }

  /** Translate wrapper options into ng-bootstrap options. */
  private toNgbOptions(options?: CbaModalOptions): NgbModalOptions {
    if (!options) {
      return { backdropClass: 'cba-modal-backdrop', windowClass: 'cba-modal-window' };
    }
    const { size, centered, dismissible, ...rest } = options;
    return {
      ...rest,
      size,
      centered,
      backdrop: dismissible === false ? 'static' : true,
      keyboard: dismissible !== false,
      backdropClass: rest.backdropClass ?? 'cba-modal-backdrop',
      windowClass: rest.windowClass ?? 'cba-modal-window',
    };
  }
}
