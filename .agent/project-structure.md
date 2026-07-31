# Project Structure

> **AI Agent Guidance:** This file is the canonical map of the `src/` directory.
> Before creating, moving, or deleting any file or folder, agents MUST consult this file to verify the target location is valid.
> Each line below describes one folder's purpose. If a folder is missing or its description is outdated, update this file as part of your work.
> The `# Folders in src/` section covers source code only. The `# Other folders` section covers project-level support directories.

# Folders in src/

- src/ - root of the publishable Angular library (ng-packagr entry via src/public-api.ts)
- src/components/ - reusable standalone Angular UI components consumed by Shell and MFEs
- src/components/module-header/ - ModuleHeader component: title, size/collapse/fullscreen actions and status indicator
- src/components/module-container/ - ModuleContainer component: wraps header + MFE content with size, collapse, fullscreen and scroll
- src/components/button/ - CbaButton component: variants primary/secondary/ghost/danger/success, sizes sm/md, loading state, icon support
- src/components/card/ - CbaCard component: optional and configurable header & footer
- src/components/badge/ - CbaBadge component: semantic colours with solid or outline styles
- src/components/empty-state/ - CbaEmptyState component: slots for icon, title, description and primary action
- src/components/skeleton/ - CbaSkeleton component: variants text, avatar, card, table-row and generic
- src/components/modal/ - CbaModal component: thin wrapper around ng-bootstrap modal
- src/components/form-field/ - internal shared CbaFieldComponent + CbaControlValueAccessor base used by input/select/datepicker (not exported publicly)
- src/components/input/ - CbaInput component: native input wrapper with ControlValueAccessor and shared field layout
- src/components/select/ - CbaSelect component: native select wrapper with projected options and ControlValueAccessor
- src/components/typeahead/ - CbaTypeahead component: thin ng-bootstrap NgbTypeahead wrapper reusing shared field layout and ControlValueAccessor
- src/components/datepicker/ - CbaDatepicker component: thin wrapper around ng-bootstrap NgbInputDatepicker with shared field layout
- src/components/dropdown/ - CbaDropdown component: thin ng-bootstrap dropdown wrapper with projected toggle and menu items
- src/components/popover/ - CbaPopover component: thin ng-bootstrap NgbPopover wrapper with projected trigger and string/template body
- src/theme/ - SCSS theme variables, utilities, mixins and entry file
- src/directives/ - attribute directives created on demand

# Other folders

- .agent/ - AI-agent context: project-info, todos, project-structure, workflows
- .kilo/ - Kilo agent configuration: rules, commands, modes, plans
- docs/ - developer documentation files
