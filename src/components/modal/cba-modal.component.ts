import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CbaModalSize } from './cba-modal.types';

let cbaModalTitleUid = 0;

/**
 * Themed modal content shell backed by `@ng-bootstrap/ng-bootstrap`.
 *
 * Renders projected header / body / footer regions inside ng-bootstrap's
 * `.modal-content`. Open/close, backdrop, ESC and focus management are owned
 * by ng-bootstrap; this component only provides a stable, token-styled
 * structure, an optional convenience `title`, and a themed close button.
 *
 * Inject `NgbActiveModal` in a host component to call `close()` / `dismiss()`
 * from footer buttons (see `docs/CBA_MODAL.md`).
 *
 * @usageNotes
 * ```html
 * <cba-modal title="Confirm deletion">
 *   <ng-container cbaModalBody>This action cannot be undone.</ng-container>
 *   <ng-container cbaModalFooter>
 *     <cba-button variant="ghost" (cbaClick)="activeModal.dismiss()">Cancel</cba-button>
 *     <cba-button variant="danger" (cbaClick)="activeModal.close(true)">Delete</cba-button>
 *   </ng-container>
 * </cba-modal>
 * ```
 *
 * @see [CBA_MODAL.md](/docs/CBA_MODAL.md)
 */
@Component({
  selector: 'cba-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-modal.component.html',
  styleUrl: './cba-modal.component.scss',
  host: {
    class: 'cba-modal',
    '[class.cba-modal--sm]': "size() === 'sm'",
    '[class.cba-modal--md]': "size() === 'md'",
    '[class.cba-modal--lg]': "size() === 'lg'",
    '[class.cba-modal--centered]': 'centered()',
  },
})
export class CbaModalComponent implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);

  /** Optional convenience title rendered in the default header. Ignored visually when a `[cbaModalHeader]` is projected — do not set both. */
  readonly title = input<string | undefined>(undefined);

  /** Width variant. Host modifier only; dialog width is driven by `CbaModalService.open` options. */
  readonly size = input<CbaModalSize>('md');

  /** Vertically-centered host modifier. Dialog centering is driven by `CbaModalService.open` options. */
  readonly centered = input<boolean>(false);

  /** When `true`, renders a themed close (×) button that dismisses the modal. */
  readonly dismissible = input<boolean>(true);

  /** Stable id for the default title element, used as `aria-labelledby`. */
  protected readonly titleId = `cba-modal-title-${cbaModalTitleUid++}`;

  /** Wires `aria-labelledby` for the default-title case (spec §8). */
  ngOnInit(): void {
    if (this.title()) {
      this.activeModal.update({ ariaLabelledBy: this.titleId });
    }
  }

  /** Dismiss the modal via ng-bootstrap when the close button is clicked. */
  protected onClose(): void {
    this.activeModal.dismiss('close');
  }
}
