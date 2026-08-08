/**
 * Default Spanish-only UI copy for @cobranza-apps/ui.
 *
 * This is a single source of truth for user-visible strings the library owns
 * (status text, aria-labels/tooltips on icon-only controls). It is NOT an i18n
 * system: there are no language codes, locale switchers, or translation
 * loaders. Consumers override copy through component inputs / content
 * projection, never through this module.
 */
export const CBA_UI_MESSAGES = {
  moduleFooter: {
    status: {
      loading: 'Cargando…',
      loaded: 'Listo',
      success: 'Guardado',
      warning: 'Requiere atención',
      error: 'Error',
      dirty: 'Cambios sin guardar',
    },
  },
  moduleHeader: {
    aria: {
      collapse: {
        expand: 'Expandir módulo',
        collapse: 'Colapsar módulo',
      },
      size: {
        shrink: 'Reducir módulo a 50%',
        expand: 'Expandir módulo a 100%',
      },
      remove: 'Quitar módulo',
      fullscreen: 'Pantalla completa',
      drag: 'Arrastrar módulo',
    },
  },
  modal: {
    aria: {
      close: 'Cerrar',
    },
  },
  datepicker: {
    aria: {
      open: 'Abrir selector de fecha',
    },
  },
} as const;
