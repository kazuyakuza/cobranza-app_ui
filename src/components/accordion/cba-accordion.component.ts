import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { NgbAccordionDirective } from '@ng-bootstrap/ng-bootstrap';

/**
 * Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` accordion.
 *
 * **Responsibility split:**
 * - ng-bootstrap owns expand/collapse, keyboard/focus handling, `aria-*`
 *   attributes, animation, and the `closeOthers`/`destroyOnHide` semantics.
 * - This component owns the Cobranza gray theme (the `.cba-accordion` host
 *   class consumed by the global `_accordion.scss` partial), a stable
 *   `cba-accordion` selector, and a thin passthrough of three inputs
 *   (`closeOthers`, `destroyOnHide`, `animation`) and four outputs
 *   (`show`, `shown`, `hide`, `hidden`).
 *
 * Consumers author the full ng-bootstrap item markup directly as projected
 * content (see `@usageNotes`); this component deliberately does not wrap
 * items in its own component.
 *
 * **Why `hostDirectives: [NgbAccordionDirective]`:** the consumer-authored
 * `<div ngbAccordionItem>` elements projected via `<ng-content>` must
 * `inject(NgbAccordionDirective)`, and the directive's `_items`
 * `ContentChildren` query must see those projected items. Only a host
 * directive on `<cba-accordion>` satisfies both; an inner `<div ngbAccordion>`
 * inside the component view is rejected because DI and content queries do not
 * cross component view boundaries.
 *
 * **Why there is no `CbaAccordionItemComponent`:** `NgbAccordionItem._collapse`
 * is a `@ContentChild({ static: true })` query, and static content queries
 * cannot cross component view boundaries. Consumers therefore author the
 * ng-bootstrap item markup directly inside `<cba-accordion>` so the static
 * query resolves in the consumer's own view.
 *
 * @usageNotes
 * ```html
 * <cba-accordion [closeOthers]="true" (shown)="onShown($event)">
 *   <div ngbAccordionItem>
 *     <div ngbAccordionHeader>
 *       <button ngbAccordionButton>Detalles del cliente</button>
 *     </div>
 *     <div ngbAccordionCollapse>
 *       <div ngbAccordionBody>
 *         <ng-template><p>Contenido del primer panel.</p></ng-template>
 *       </div>
 *     </div>
 *   </div>
 *
 *   <div ngbAccordionItem [disabled]="true">
 *     <div ngbAccordionHeader>
 *       <button ngbAccordionButton>Histórico de pagos</button>
 *     </div>
 *     <div ngbAccordionCollapse>
 *       <div ngbAccordionBody>
 *         <ng-template><p>Contenido deshabilitado.</p></ng-template>
 *       </div>
 *     </div>
 *   </div>
 *
 *   <div ngbAccordionItem>
 *     <div ngbAccordionHeader>
 *       <button ngbAccordionButton>Documentación</button>
 *     </div>
 *     <div ngbAccordionCollapse>
 *       <div ngbAccordionBody>
 *         <ng-template><p>Contenido del tercer panel.</p></ng-template>
 *       </div>
 *     </div>
 *   </div>
 * </cba-accordion>
 * ```
 *
 * @remarks
 * Behaviour (expand/collapse, keyboard, aria, animation, id generation) comes
 * from `@ng-bootstrap/ng-bootstrap`; `CbaAccordion` only adds theming, a
 * stable selector, and thin passthroughs.
 *
 * @see [CBA_ACCORDION.md](/docs/CBA_ACCORDION.md)
 */
@Component({
  selector: 'cba-accordion',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgbAccordionDirective],
  templateUrl: './cba-accordion.component.html',
  styleUrl: './cba-accordion.component.scss',
  host: { class: 'cba-accordion' },
})
export class CbaAccordionComponent {
  /** When `true`, only one item can be expanded at a time; expanding another item collapses the open one. Defaults to `false`. */
  readonly closeOthers = input<boolean>(false);

  /** When `true`, an item's body content is removed from the DOM when collapsed. Defaults to `true`. */
  readonly destroyOnHide = input<boolean>(true);

  /** When `true`, expand/collapse transitions are animated. Defaults to `true`. */
  readonly animation = input<boolean>(true);

  /** Emitted before an item expanding animation starts, with the item id. */
  readonly show = output<string>();

  /** Emitted when an item expanding animation finishes, with the item id. */
  readonly shown = output<string>();

  /** Emitted before an item collapsing animation starts, with the item id. */
  readonly hide = output<string>();

  /** Emitted when an item collapsing animation finishes, with the item id. */
  readonly hidden = output<string>();

  private readonly ngbAccordion = inject(NgbAccordionDirective);

  constructor() {
    this.reemitAccordionEvents();
    this.forwardInputsToNgbAccordion();
  }

  /** Re-emits the `NgbAccordionDirective` item events through the wrapper outputs. */
  private reemitAccordionEvents(): void {
    this.ngbAccordion.show.subscribe((itemId: string) => this.show.emit(itemId));
    this.ngbAccordion.shown.subscribe((itemId: string) => this.shown.emit(itemId));
    this.ngbAccordion.hide.subscribe((itemId: string) => this.hide.emit(itemId));
    this.ngbAccordion.hidden.subscribe((itemId: string) => this.hidden.emit(itemId));
  }

  /** Reactively forwards every wrapper input to the host `NgbAccordionDirective`. */
  private forwardInputsToNgbAccordion(): void {
    effect(() => {
      this.ngbAccordion.closeOthers = this.closeOthers();
      this.ngbAccordion.destroyOnHide = this.destroyOnHide();
      this.ngbAccordion.animation = this.animation();
    });
  }
}
