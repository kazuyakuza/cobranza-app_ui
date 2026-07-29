/**
 * Public entry point for @cobranza-apps/ui.
 *
 * Single barrel re-exporting all public components, directives and theme of the
 * Cobranza App Company Back-office UI library. Consumed by the Shell and every
 * Micro-frontend (MFE) via `ng-packagr` (configured in ../../ng-package.json).
 *
 * @todo Add re-exports as components, directives and theme become available:
 *   - Components: ModuleHeader, ModuleContainer, CbaButton, CbaCard, CbaBadge,
 *     CbaEmptyState, CbaSkeleton, CbaModal.
 *   - Directives: lightweight attribute directives (e.g. autofocus, click-outside).
 *   - Theme: SCSS variables, utilities and mixins (re-exported where applicable).
 *
 * Keep this file as the ONLY public surface until secondary entry points are
 * introduced (see architecture.md "Public API Strategy").
 */
export {};
