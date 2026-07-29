# Project Structure

# Folders in src/

- src/lib/ - root of the publishable Angular library (ng-packagr entry via src/lib/public-api.ts)
- src/lib/components/ - reusable standalone Angular UI components consumed by Shell and MFEs
- src/lib/components/module-header/ - ModuleHeader component: Shell-injected header with title, size/collapse/fullscreen actions and status indicator
- src/lib/components/module-container/ - ModuleContainer component: wraps ModuleHeader + MFE content; handles size, collapse, fullscreen, padding and internal scroll
- src/lib/components/button/ - CbaButton component: variants primary/secondary/ghost/danger/success, sizes sm/md, loading state, icon support
- src/lib/components/card/ - CbaCard component: optional and configurable header & footer
- src/lib/components/badge/ - CbaBadge component: semantic colours with solid or outline styles
- src/lib/components/empty-state/ - CbaEmptyState component: slots for icon, title, description and primary action
- src/lib/components/skeleton/ - CbaSkeleton component: variants text, avatar, card, table-row and generic
- src/lib/components/modal/ - CbaModal component: thin wrapper around ng-bootstrap modal
- src/lib/theme/ - SCSS theme package intended to contain _variables.scss, _utilities.scss, _mixins.scss and theme.scss (CSS variables under --cba- prefix)
- src/lib/directives/ - lightweight attribute directives created on demand (e.g. autofocus, click-outside)

# Other folders

- .agent/ - AI-agent context: project-info, todos, project-structure, workflows
- .kilo/ - Kilo agent configuration: rules, commands, modes, plans
- docs/ - developer documentation files
