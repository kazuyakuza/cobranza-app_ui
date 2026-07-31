import { OperatorFunction } from 'rxjs';
import { NgbTypeaheadSelectItemEvent, PlacementArray } from '@ng-bootstrap/ng-bootstrap';

/**
 * Search function passed to `NgbTypeahead`. Maps a stream of typed terms to a
 * stream of result arrays. The engine (debounce/filter/popup) is ng-bootstrap.
 */
export type CbaTypeaheadSearchFn = OperatorFunction<string, readonly any[]>;

/**
 * Formats a popup result item (or a selected item back into the input).
 * Mirrors `NgbTypeahead`'s `resultFormatter` / `inputFormatter` signatures.
 */
export type CbaTypeaheadFormatter = (item: any) => string;

/**
 * Preferred popup placement(s). Mirrors `PlacementArray` from ng-bootstrap.
 */
export type CbaTypeaheadPlacement = PlacementArray;

/**
 * Selection event re-emitted by `itemSelected`. Mirrors
 * `NgbTypeaheadSelectItemEvent` from ng-bootstrap.
 */
export type CbaTypeaheadItemSelectedEvent = NgbTypeaheadSelectItemEvent;
