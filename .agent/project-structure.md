# Project Structure

> **AI Agent Guidance:** This file is the canonical map of the `src/` directory.
> Before creating, moving, or deleting any file or folder, agents MUST consult this file to verify the target location is valid.
> Each line below describes one folder's purpose. If a folder is missing or its description is outdated, update this file as part of your work.
> The `# Folders in src/` section covers source code only. The `# Other folders` section covers project-level support directories.

# Folders in src/

- src/lib/ - root of the publishable Angular library (ng-packagr entry via src/lib/public-api.ts)
- src/lib/components/ - reusable standalone Angular UI components consumed by Shell and MFEs
- src/lib/components/module-header/ - ModuleHeader component: title, size/collapse/fullscreen actions and status indicator
- src/lib/components/module-container/ - ModuleContainer component: wraps header + MFE content with size, collapse, fullscreen and scroll
- src/lib/components/button/ - CbaButton component: variants primary/secondary/ghost/danger/success, sizes sm/md, loading state, icon support
- src/lib/components/card/ - CbaCard component: optional and configurable header & footer
- src/lib/components/badge/ - CbaBadge component: semantic colours with solid or outline styles
- src/lib/components/empty-state/ - CbaEmptyState component: slots for icon, title, description and primary action
- src/lib/components/skeleton/ - CbaSkeleton component: variants text, avatar, card, table-row and generic
- src/lib/components/modal/ - CbaModal component: thin wrapper around ng-bootstrap modal
- src/lib/theme/ - SCSS theme variables, utilities, mixins and entry file
- src/lib/directives/ - attribute directives created on demand

# Other folders

- .agent/ - AI-agent context: project-info, todos, project-structure, workflows
- .kilo/ - Kilo agent configuration: rules, commands, modes, plans
- docs/ - developer documentation files
