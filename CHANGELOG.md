# Changelog

All notable changes to `@edulution-io/ui-kit` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.87] - 2026-04-21

## [2.0.86] - 2026-04-20

### Added

- `MenuBar`: recursively nested submenus. Items can now declare `children` of arbitrary depth. Up to `maxDepth` (default 5) nodes render inline as expandable accordions; deeper nodes switch to a drill-down view with a back button.
- `MenuBar`: new props `isChildActive`, `onChildClick`, `maxDepth`, `backLabel`. `isChildActive` is a predicate evaluated against every child at any depth to determine the active node — MenuBar walks the tree internally, so consumers no longer need their own tree traversal to derive the active child id.

### Changed

- `MenuBarConfigItem.icon` is now optional.
- `MenuBarConfigItem.children` is now `MenuBarConfigItem[]` (recursive) instead of the previous flat child type.

### Removed

- `MenuBar`: `activeChildId` prop removed. Pass `isChildActive` instead (e.g. `isChildActive={(item) => item.id === activeId}`).
- `MenuBarConfigChildItem` type export. Use `MenuBarConfigItem` (recursive) instead.

## [2.0.85] - 2026-04-20

## [2.0.84] - 2026-04-17

## [2.0.83] - 2026-04-16

### Fixed

- `DropdownSelect`: selected value / placeholder text was clipped under the chevron on narrow widths. Switched the trigger from `type="button"` to `type="text"` (read-only) so padding and text-alignment behave consistently, and added `truncate` so long labels end with an ellipsis before the arrow.

## [2.0.78] - 2026-04-14

### Added

- `Button`: new `btn-white` variant for light/white secondary buttons on white backgrounds (e.g. login page cancel button), replacing the manual `border-none text-black shadow-xl hover:bg-ciGrey/10 hover:text-black` override pattern.

## [2.0.77] - 2026-04-14

### Added

- Moved Dialog and Sheet components

## [2.0.67] - 2026-04-07

### Changes

- Removed base layer class from theme.css

## [2.0.61] - 2026-03-27

### Changed

- Add `react-hook-form` as required peer dependency for consumer-provided form context/runtime alignment
- Restore runtime `dependencies` in `libs/ui-kit/package.json` for all external packages used by the published UI kit API/types
- Update UI-kit related package versions:
  - `@fontsource/lato` to `^5.2.7`
  - `@fortawesome/fontawesome-svg-core` to `^7.2.0`
  - `@fortawesome/free-solid-svg-icons` to `^7.2.0`
  - `@fortawesome/react-fontawesome` to `^3.3.0`

### Added

- Move additional components into `@edulution-io/ui-kit` and export them via package index:
  `Breadcrumb`, `Calendar`, `Checkbox`, `DraggableTableRow`, `DropZone`, `DropdownSelect`, `Form`, `FullScreenImage`, `HourButton`, `ImageComponent`, `MinuteButton`, `ProgressBox`
- Add component tests for all moved components listed above
- Add dependency sync/check tooling for `libs/ui-kit/package.json` version alignment with root `package.json`
- Add pre-commit validation for UI-kit dependency version drift (`check:ui-kit-deps`)

## [2.0.60] - 2026-03-26

## [2.0.59] - 2026-03-26

## [2.0.58] - 2026-03-26

### Added

- Move wrapper components into `@edulution-io/ui-kit` and export them via package index:
  `Accordion`, `Avatar`, `Badge`, `Command`, `DropdownMenu`, `InputOtp`, `RadioGroup`
- Add component tests for all moved wrapper components

## [2.0.57] - 2026-03-26

### Added

- Move additional primitive components into `@edulution-io/ui-kit` and export them via package index:
  `CircleLoader`, `DynamicEllipsis`, `FileSelectButton`, `HorizontalLoader`, `MediaComponent`, `NumberPad`, `QRCodeDisplay`, `TextPreview`
- Add component tests for the moved primitive components

### Changed

- Bundle all dependencies except react, react-dom, and tailwindcss to reduce consumer install footprint
- Add tailwindcss as peer dependency
- Add tailwind.config.ts as Vite build entry

## [1.0.1] - 2026-03-26

## [1.0.0] - 2026-03-24

### Added

- 38 React components: Accordion, ActionTooltip, AnchorSection, Avatar, Badge, Button, Card, CardContent, CircleLoader, Command, DropdownMenu, DynamicEllipsis, FileSelectButton, HorizontalLoader, IconWithCount, Input, InputOTP, InputWithActionIcons, Label, MediaComponent, MenuBar, MenuBarHeader, MenuBarItem, MenuBarItemList, MenuBarLayout, NumberPad, Popover, Progress, QRCodeDisplay, RadioGroup, ScrollArea, Separator, Switch, Table, Tabs, Textarea, TextPreview, Tooltip, WarningBox
- Hooks: useMediaQuery, useOnClickOutside
- Utility: cn (clsx + tailwind-merge)
- Constants: INPUT_BASE_CLASSES, VARIANT_COLORS, inputOTPSlotVariants, inputOTPCaretVariants
- Tailwind CSS theme configuration exported for consumers
- Theme CSS variables via styles/theme.css
- Font imports via styles/fonts (Lato from @fontsource)
- Full TypeScript type definitions with source maps
- Test coverage for all components

## [0.0.1] - 2025-01-01

### Added

- Initial project setup
