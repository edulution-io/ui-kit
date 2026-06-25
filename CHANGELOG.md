# Changelog

All notable changes to `@edulution-io/ui-kit` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.302] - 2026-06-25

## [2.0.301] - 2026-06-24

### Added

- New `CountBadge` component — a compact pill rendering a clamped numeric count (via `formatCountBadge`) with the shared unread/notification styling. Replaces the duplicated badge markup in `MenuBarItem`, `MenuBarSubItem`, and downstream consumers.

### Changed

- `MenuBarItem` now renders a childless item's own `badge` (previously only the aggregated child-badge sum was shown), so leaf menu items can display an unread count.

## [2.0.300] - 2026-06-24

## [2.0.299] - 2026-06-24

### Added

- `AddCard` — a fully clickable "create new" placeholder card built on the same section-card surface, with a centered icon tile plus `title` and optional `description`. The matching `AddCardProps` type is exported.
- `StatValue` — a numeric stat display with an emphasized `value` and an optional muted `/ total` denominator, optional `unit` and trailing `label`, plus an `md`/`lg` `size` scale. The matching `StatValueProps` and `StatValueSize` types are exported.

## [2.0.298] - 2026-06-24

## [2.0.297] - 2026-06-24

## [2.0.296] - 2026-06-24

## [2.0.295] - 2026-06-23

## [2.0.294] - 2026-06-23

## [2.0.293] - 2026-06-23

## [2.0.292] - 2026-06-23

## [2.0.291] - 2026-06-23

## [2.0.290] - 2026-06-22

## [2.0.289] - 2026-06-22

## [2.0.288] - 2026-06-22

## [2.0.287] - 2026-06-22

## [2.0.286] - 2026-06-22

## [2.0.285] - 2026-06-22

### Fixed

- `liquid-glass-card`: the `::before` sheen gradient no longer paints over the card content (it washed out text, especially in light mode). The pseudo-element is now placed behind the content (`z-index: -1`) and the card establishes its own stacking context (`isolation: isolate`), so titles and body text render at full contrast.

## [2.0.284] - 2026-06-22

## [2.0.283] - 2026-06-19

## [2.0.282] - 2026-06-19

## [2.0.281] - 2026-06-19

### Added

- New `liquid-glass-overlay` material — a translucent tinted glass surface (~55% dark / ~62% light tint + `blur(24px) saturate(180%)` + a subtle top-edge rim highlight). Used for the overlay/mobile sidebar so it keeps a see-through frosted-glass look while staying legible and theme-consistent over any backdrop, including in Safari.

### Fixed

- Safari now renders the glass surfaces (`liquid-glass`, `liquid-glass-panel`, `liquid-glass-tile`, `liquid-glass-soft`) with their backdrop blur: added the `-webkit-backdrop-filter` prefix to each declaration plus a `@supports` fallback for engines without `backdrop-filter` support. Previously these surfaces collapsed to a near-transparent base in Safari.

## [2.0.280] - 2026-06-19

## [2.0.279] - 2026-06-19

## [2.0.278] - 2026-06-19

## [2.0.277] - 2026-06-19

## [2.0.276] - 2026-06-19

## [2.0.275] - 2026-06-18

## [2.0.274] - 2026-06-18

## [2.0.273] - 2026-06-18

## [2.0.272] - 2026-06-18

## [2.0.271] - 2026-06-18

- New exporting className in `inputClassNames.ts` for inputs inside of dialogs that are static (less heighlights/effects), called `DIALOG_CARD_WITHOUT_HOVER`, now re-exported from the package root (`@edulution-io/ui-kit`)

## [2.0.270] - 2026-06-18

## [2.0.269] - 2026-06-18

## [2.0.268] - 2026-06-18

## [2.0.267] - 2026-06-18

## [2.0.266] - 2026-06-18

## [2.0.265] - 2026-06-18

## [2.0.264] - 2026-06-18

## [2.0.263] - 2026-06-17

## [2.0.262] - 2026-06-17

## [2.0.261] - 2026-06-17

## [2.0.260] - 2026-06-17

### Changed

- Retired the `ciLightBlue` color token (`--ci-light-blue`). The `Card` `organisation` variant and `CircleLoader` light-mode spinner now use `primary`. Consumers relying on the `ciLightBlue` Tailwind utility should switch to `primary` or `ciDarkBlue`.

### Removed

- Removed the unused `Card` variants `collaboration` and `infrastructure`. The default `Card` variant is now `organisation` (unchanged `border-primary border-4` styling).

## [2.0.259] - 2026-06-17

## [2.0.258] - 2026-06-17

## [2.0.257] - 2026-06-17

## [2.0.256] - 2026-06-17

## [2.0.255] - 2026-06-17

## [2.0.254] - 2026-06-17

## [2.0.253] - 2026-06-17

## [2.0.252] - 2026-06-17

## [2.0.251] - 2026-06-17

### Added

- `MenuBarItemActions` — a per-item context-action (three-dot/kebab) menu for `MenuBar` rows. It renders a kebab trigger (revealed on hover/focus, always visible on touch) that opens a `DropdownMenu` of the item's actions, with optional per-action separators and a destructive style. The matching `MenuBarItemAction` type is exported.
- `MenuBarConfigItem` gains an optional `contextActions` field; when set, the item's row renders a `MenuBarItemActions` menu. Items without it are unaffected.
- `MenuBar` gains an optional `itemActionsLabel` prop (defaults to `"Actions"`) for the accessible label of the context-action triggers.

### Fixed

- `DropdownMenuItem` now shows a hover/highlight background (`focus:bg-accent` / `data-[highlighted]:bg-accent`), matching `DropdownMenuCheckboxItem` and `DropdownMenuRadioItem`. Previously plain menu items had no visual highlight on hover or keyboard navigation.

## [2.0.250] - 2026-06-16

## [2.0.249] - 2026-06-16

## [2.0.248] - 2026-06-16

## [2.0.247] - 2026-06-16

## [2.0.246] - 2026-06-16

## [2.0.245] - 2026-06-16

## [2.0.244] - 2026-06-16

## [2.0.243] - 2026-06-16

## [2.0.242] - 2026-06-16

## [2.0.241] - 2026-06-16

## [2.0.240] - 2026-06-16

## [2.0.239] - 2026-06-16

## [2.0.238] - 2026-06-15

## [2.0.237] - 2026-06-15

## [2.0.236] - 2026-06-15

## [2.0.235] - 2026-06-15

## [2.0.234] - 2026-06-15

## [2.0.233] - 2026-06-15

## [2.0.232] - 2026-06-15

## [2.0.231] - 2026-06-12

### Added

- `TimeUnitButton` — generic button for selecting a numeric time unit (hour or minute) in a time picker; accepts an optional `format` function to control the displayed label

### Changed

- `HourButton`, `MinuteButton`: refactored as thin wrappers around the new shared `TimeUnitButton`

## [2.0.230] - 2026-06-12

### Added

- `Button`: added the `btn-window-control` variant for fixed-size window toolbar controls (self-sizing `h-10 w-16`, square corners, transparent ghost surface with `hover:bg-accent-light`). Like `btn-ghost`, it ignores the default `size` so callers do not need to pass `size="none"`.

## [2.0.229] - 2026-06-12

## [2.0.228] - 2026-06-12

### Added

- `SectionCard`: the standard liquid-glass content surface for page sections, moved from the edulution-ui frontend into the package. `SectionCardProps`, `SectionCardVariant`, `SectionCardPadding`, and the `SECTION_CARD_STYLES` class constants are exported for consumers that compose the same surface themselves

## [2.0.227] - 2026-06-12

### Changed

- `useOnClickOutside` now listens on `pointerdown` instead of `mousedown` + `touchstart`, so Apple Pencil and other pen input devices reliably trigger outside-click detection.
- `DropdownSelect` closes its own menu on `pointerdown` instead of `mousedown`, so a pen tap outside the menu dismisses it even when the compatibility `mousedown` event is suppressed.
- `ActionTooltip` is now controlled and opens on pen/touch `pointerdown`, with an auto-close timer, so tooltips are reachable without a hover state (e.g. Apple Pencil on iPad).
- `ResizableHandle` (`ResizablePanelGroup`) sets `touch-action: none` on the separator to keep Safari from hijacking pen/touch drags as page scrolls.
- `DropdownSelect` scroll container sets `touch-action: pan-y`, so vertical pen/touch scroll inside the menu is not blocked by ancestor gesture handling.
- `Button` synthesizes a click on `pointerdown` when `pointerType === 'pen'`, working around the known Radix UI bug where Pencil pointer events are swallowed inside Dialog/Popover/Dropdown (radix-ui/primitives#3052). The logic now lives in the shared `synthesizePenClick` helper.
- `DropdownMenuItem` synthesizes a click on pen `pointerdown` (via `synthesizePenClick`) and no longer binds `onTouchStart`, fixing both unreachable Apple Pencil taps inside menus and a double `onClick` on finger taps.

### Fixed

- `synthesizePenClick` no longer double-fires on Apple Pencil: it suppresses the native echo click that follows its synthesized click, so toggles (e.g. the mobile sidebar/menu-bar buttons) open and stay open instead of immediately toggling closed.
- `synthesizePenClick` no longer drops a second Apple Pencil tap that lands within the echo-suppression window: a stale echo suppressor from a prior tap is now torn down before a new one is installed, so rapid repeated pen taps on Buttons/MenuBarItems/NavLinks each fire reliably.
- `synthesizePenClick` no longer loses one of two pen taps that land in the same animation frame: the synthesized-click marker is now tracked per target instead of per invocation, so a tap's synthesized click is no longer swallowed by a later tap's echo suppressor under main-thread jank.

## [2.0.226] - 2026-06-11

### Added

- `formatCountBadge`: shared helper to format a numeric badge count, clamping values above `max` (default `99`) to a `"<max>+"` string, so every surface clamps notification/unread counts identically.

### Changed

- `IconWithCount`, `MenuBarItem`, `MenuBarSubItem`: badge counts now use `formatCountBadge` instead of an inline `> 99 ? '99+'` clamp.

## [2.0.225] - 2026-06-11

## [2.0.224] - 2026-06-11

## [2.0.223] - 2026-06-11

## [2.0.222] - 2026-06-11

## [2.0.221] - 2026-06-11

## [2.0.220] - 2026-06-11

## [2.0.219] - 2026-06-11

## [2.0.218] - 2026-06-09

## [2.0.217] - 2026-06-09

## [2.0.216] - 2026-06-09

## [2.0.215] - 2026-06-09

## [2.0.214] - 2026-06-08

## [2.0.213] - 2026-06-08

## [2.0.212] - 2026-06-08

### Changed

- `WarningBox`: added typed `variant` prop (`warning` | `error` | `success` | `info`) with corrected per-mode color tokens; warning and error text are now readable in light mode. `WarningBoxVariant` is exported as a public type for consumers
- `Button`, `Table`, `NumberPad`, `CircleLoader`, `ImageComponent`, `HexagonIcon`: migrated to channelized semantic color tokens
- `inputClassNames`: updated to semantic color tokens
- `theme.css`: channelized CI color variables to support Tailwind opacity modifiers

## [2.0.211] - 2026-06-05

## [2.0.210] - 2026-06-04

## [2.0.209] - 2026-06-03

### Added

- `MenuBar` items can opt into drag-and-drop: `MenuBarConfigItem.dropData` (typed `MenuBarDropData`) registers the item's row as a `@dnd-kit` droppable, highlighted while hovered by a matching drag. Items without `dropData` stay inert. This applies to both nested rows and top-level (`MenuBarItem`) rows.
- `MenuBarSubItem` gains an `isVisible` prop so rows hidden inside a collapsed ancestor disable their droppable instead of capturing drops while off-screen.
- `MenuBar` rows with collapsed children spring open during a drag: hovering a collapsed parent for ~600ms while dragging auto-expands it, so nested drop targets become reachable without dropping the drag. This works for both top-level (`MenuBarItem`) and nested rows, including container parents that have no `dropData` of their own — their row stays a hover target purely to spring open, while a drop on it still does nothing. The expand/collapse animation is skipped while a drag is active so `@dnd-kit` measures stable row positions and the drop lands on the row under the pointer.

## [2.0.208] - 2026-06-03

## [2.0.207] - 2026-06-03

## [2.0.206] - 2026-06-02

## [2.0.205] - 2026-06-02

## [2.0.204] - 2026-06-02

## [2.0.203] - 2026-06-02

## [2.0.202] - 2026-06-02

## [2.0.201] - 2026-06-02

### Added

- `Chip` component – a compact, clickable inline chip/tag button (e.g. for copyable values like email addresses).

## [2.0.200] - 2026-05-29

## [2.0.199] - 2026-05-29

## [2.0.198] - 2026-05-29

## [2.0.197] - 2026-05-29

## [2.0.196] - 2026-05-28

## [2.0.195] - 2026-05-28

## [2.0.194] - 2026-05-27

## [2.0.193] - 2026-05-27

## [2.0.192] - 2026-05-27

## [2.0.191] - 2026-05-27

## [2.0.190] - 2026-05-27

## [2.0.189] - 2026-05-26

## [2.0.188] - 2026-05-26

## [2.0.187] - 2026-05-22

## [2.0.186] - 2026-05-22

## [2.0.185] - 2026-05-22

## [2.0.184] - 2026-05-22

## [2.0.183] - 2026-05-22

## [2.0.182] - 2026-05-21

## [2.0.181] - 2026-05-21

## [2.0.180] - 2026-05-21

## [2.0.179] - 2026-05-21

## [2.0.178] - 2026-05-21

## [2.0.177] - 2026-05-21

## [2.0.176] - 2026-05-21

## [2.0.175] - 2026-05-21

## [2.0.174] - 2026-05-20

_Release-train alignment with the consuming app — no library changes._

## [2.0.173] - 2026-05-20

_Release-train alignment with the consuming app — no library changes._

## [2.0.172] - 2026-05-20

_Release-train alignment with the consuming app — no library changes._

## [2.0.171] - 2026-05-20

_Release-train alignment with the consuming app — no library changes._

## [2.0.170] - 2026-05-20

_Release-train alignment with the consuming app — no library changes._

## [2.0.169] - 2026-05-20

### Fixed

- `Badge`: `outline` variant text color changed from `text-background` to `text-foreground`. The variant previously used the page-background token as its text color, making the label invisible against the badge surface; it now uses the readable foreground token.

## [2.0.168] - 2026-05-20

_Release-train alignment with the consuming app — no library changes._

## [2.0.167] - 2026-05-20

_Release-train alignment with the consuming app — no library changes._

## [2.0.166] - 2026-05-19

_Release-train alignment with the consuming app — no library changes._

## [2.0.165] - 2026-05-19

_Release-train alignment with the consuming app — no library changes._

## [2.0.164] - 2026-05-19

### Added

- `ItemList` — new public component for rendering a compact, recipe-aligned list of named items used in confirmation and warning dialogs. Exposes a `layout` prop with `'list'` (default — vertical scrollable list via `ScrollArea`, single items render as a centered paragraph) and `'inline'` (comma-separated paragraph that wraps within `max-w-[24rem]`, `font-medium` for contrast against colored backgrounds). Renders nothing when `items` is empty. Public types: `ItemListProps`, `ItemListLayout`, `ListItem`. `ListItem` is now co-located with the component; the previous orphan `libs/src/ui/types/listItem.ts` is deleted and consumers import the type from `@edulution-io/ui-kit`.

### Changed

- `WarningBox`: file/folder name list now delegates rendering to `ItemList` with `layout='inline'` instead of re-implementing a vertical list. The upload-duplicate warning therefore renders names as a comma-separated wrapping paragraph capped to `max-w-[24rem]`, keeping the dialog compact and readable against the warning background.

## [2.0.163] - 2026-05-19

_Release-train alignment with the consuming app — no library changes._

## [2.0.162] - 2026-05-18

### Changed

- `MenuBarItem`, `MenuBarSubItem`: unread badge restyled for a compact, subtle appearance. Dimensions tightened (`h-4 min-w-4` instead of `h-5 min-w-[1.25rem]`), padding reduced (`px-1` instead of `px-1.5`), typography updated (`text-[10px] font-medium tabular-nums leading-none` instead of `text-xs font-semibold`), and background changed from `bg-ciRed` to `bg-accent` with `text-foreground dark:text-primary-foreground` so the badge reads against both themes.
- `MenuBarItem`: icon slot is now wrapped in a `<span>` that applies `[&_*]:!text-primary-foreground` when the item is active, so nested icons recolor consistently with the active label.

## [2.0.161] - 2026-05-18

_Release-train alignment with the consuming app — no library changes._

## [2.0.160] - 2026-05-18

_Release-train alignment with the consuming app — no library changes._

## [2.0.159] - 2026-05-18

_Release-train alignment with the consuming app — no library changes._

## [2.0.158] - 2026-05-18

_Release-train alignment with the consuming app — no library changes._

## [2.0.157] - 2026-05-15

_Release-train alignment with the consuming app — no library changes._

## [2.0.156] - 2026-05-15

_Release-train alignment with the consuming app — no library changes._

## [2.0.155] - 2026-05-15

_Release-train alignment with the consuming app — no library changes._

## [2.0.154] - 2026-05-15

### Changed

- `MenuBarItem`: hover/focus indicator color changed from `bg-ciGreen` to `bg-primary` so the left-edge accent matches the brand primary token in both themes.

## [2.0.153] - 2026-05-15

_Release-train alignment with the consuming app — no library changes._

## [2.0.152] - 2026-05-15

_Release-train alignment with the consuming app — no library changes._

## [2.0.151] - 2026-05-15

_Release-train alignment with the consuming app — no library changes._

## [2.0.150] - 2026-05-13

_Release-train alignment with the consuming app — no library changes._

## [2.0.149] - 2026-05-13

_Release-train alignment with the consuming app — no library changes._

## [2.0.148] - 2026-05-13

_Release-train alignment with the consuming app — no library changes._

## [2.0.147] - 2026-05-13

### Fixed

- `CardList`: bulk-action toolbar gained an invisible `border-l-2 border-l-transparent` so its content aligns horizontally with the rows below, which carry an active/selected left border of the same width. The toolbar checkbox no longer jumps when a row becomes active.

### Changed

- `FileSelectButton`: label className composition refactored to use the shared `cn()` utility (instead of template-literal concatenation). No visual change.

## [2.0.146] - 2026-05-13

_Release-train alignment with the consuming app — no library changes._

## [2.0.145] - 2026-05-13

_Release-train alignment with the consuming app — no library changes._

## [2.0.144] - 2026-05-12

_Release-train alignment with the consuming app — no library changes._

## [2.0.143] - 2026-05-12

_Release-train alignment with the consuming app — no library changes._

## [2.0.142] - 2026-05-12

### Changed

- `Button`, `Card`, `FileSelectButton`, `IconWithCount`, `MenuBarSubItem`: replaced `text-white` over brand backgrounds with `text-primary-foreground` (which resolves to `#ffffff` in both themes — no visual change).
- `DropZone`: replaced `text-gray-400` with the semantic `text-muted-foreground` token so disabled / placeholder text adapts to the active theme.

## [2.0.141] - 2026-05-11

### Fixed

- `package.json`: added `**/styles/fonts.ts` and `**/styles/fonts.js` to the `sideEffects` array so the bundler does not tree-shake the Lato font registration. Previously fonts were missing in consumer production builds because the side-effectful font imports were dropped by the optimizer.

## [2.0.140] - 2026-05-11

_Release-train alignment with the consuming app — no library changes._

## [2.0.139] - 2026-05-08

_Release-train alignment with the consuming app — no library changes._

## [2.0.138] - 2026-05-08

_Release-train alignment with the consuming app — no library changes._

## [2.0.137] - 2026-05-08

_Release-train alignment with the consuming app — no library changes._

## [2.0.136] - 2026-05-08

_Release-train alignment with the consuming app — no library changes._

## [2.0.135] - 2026-05-08

_Release-train alignment with the consuming app — no library changes._

## [2.0.134] - 2026-05-08

_Release-train alignment with the consuming app — no library changes._

## [2.0.133] - 2026-05-07

_Release-train alignment with the consuming app — no library changes._

## [2.0.132] - 2026-05-07

_Release-train alignment with the consuming app — no library changes._

## [2.0.131] - 2026-05-06

### Changed

- `MenuBarLayout`: sidebar surface class changed from `liquid-glass` to `liquid-glass liquid-glass-panel` in both desktop and mobile drawer modes, so the menu inherits the same panel surface as Dialog / Popover / DropdownMenu. The wrapper still keeps `!rounded-lg border-0`.
- `liquid-glass-panel` (and the combined `.liquid-glass.liquid-glass-panel` form): CSS rules raised in specificity (`html :is(...)` for the dark default, `.light :is(...)` for the light theme) so the translucent panel background and border-color are no longer overridden by Tailwind background utilities applied on the same element. A new `theme.spec.ts` snapshot guards the selectors.
- `ResizablePanelGroup`: now adds `flex-row` for horizontal groups and `flex-col` for vertical groups (in addition to the existing `flex h-full w-full`). Vertical orientations previously laid out children horizontally because `flex-direction` was inherited, producing incorrect handle placement.

### Removed

- `liquid-glass`, `liquid-glass-panel`, `liquid-glass-card`, `liquid-glass-tile`: removed redundant `-webkit-backdrop-filter` declarations. Modern Chromium/Safari implement the standard `backdrop-filter` directly, and the duplicated property added bundle weight without any rendering benefit.

## [2.0.130] - 2026-05-06

_Release-train alignment with the consuming app — no library changes._

## [2.0.129] - 2026-05-06

_Release-train alignment with the consuming app — no library changes._

## [2.0.128] - 2026-05-06

_Release-train alignment with the consuming app — no library changes._

## [2.0.127] - 2026-05-06

_Release-train alignment with the consuming app — no library changes._

## [2.0.126] - 2026-05-06

_Release-train alignment with the consuming app — no library changes._

## [2.0.125] - 2026-05-05

### Added

- `useElementWidth(ref)` hook — returns the element's `clientWidth` and keeps it in sync via a `ResizeObserver`. Returns `0` when the ref is unattached or `ResizeObserver` is unavailable. Intended for layout hooks that need to react to width changes without re-rendering on every animation frame.
- `useCenterScroll(ref, targetPx, containerWidth, trackWidthPx)` hook — sets `scrollLeft` on the referenced element so `targetPx` is centered horizontally. Re-runs whenever the target, container width, or track width change, and clamps to `[0, trackWidthPx - containerWidth]` so the scroll position never overshoots either end. No-op when the ref has no element or `containerWidth` is `0`.

## [2.0.124] - 2026-05-05

_Release-train alignment with the consuming app — no library changes._

## [2.0.123] - 2026-05-05

_Release-train alignment with the consuming app — no library changes._

## [2.0.122] - 2026-05-05

_Release-train alignment with the consuming app — no library changes._

## [2.0.121] - 2026-05-05

_Release-train alignment with the consuming app — no library changes._

## [2.0.120] - 2026-05-05

### Added

- `ResizablePanelGroup` / `ResizablePanel` / `ResizableHandle` — two-pane resizable layout primitives built on `react-resizable-panels`. Provide keyboard navigation (Arrow / Home / End), WAI-ARIA `role="separator"`, touch-friendly hit targets, and optional `localStorage` persistence via `autoSaveId`. Use `withHandle` on `ResizableHandle` to render a visible grip indicator. Pass a stable `id` to each `ResizablePanel` when panels are conditionally rendered so persisted layouts survive panel-set changes. New `useResizablePanelLayout` hook exposes layout state for consumers. `react-resizable-panels` added as a runtime dependency.
- `SplitPane` — two-pane resizable layout primitive composed on top of `ResizablePanelGroup`. Handles mobile single-pane fallback (configurable via `mobileBreakpointQuery` and `mobilePane`), optional `localStorage` persistence (`autoSaveId`), and percentage sizing including preset shorthands (`'1/4'`, `'1/3'`, `'1/2'`, `'2/3'`, `'3/4'`). Supports `orientation="vertical"` for top/bottom splits. Min/max/default sizes are interpreted as percentages of the parent group. Public types: `SplitPaneProps`, `SplitPaneOrientation`, `SplitPanePreset`, `SplitPaneSide`. `autoSaveId` must be unique per instance — two SplitPanes sharing the same value alias each other's persisted layouts in `localStorage`.

### Changed

- `CardList`: bulk-action toolbar moved out of the scroll container and rendered as a fixed header above it. Previously the toolbar was a `sticky top-0` row inside the scroll viewport with a translucent `bg-muted/95 backdrop-blur-sm` background; it now sits in a dedicated `h-12 shrink-0` row with a single `border-b border-muted` separator. The toolbar therefore stays anchored without overlapping list items, and the scroll container regains its full height.
- `Table` (`TableHead`): now defaults `scope="col"` on the rendered `<th>` element (still overridable via the `scope` prop). Improves screen-reader cell association when consumers do not pass an explicit scope.

## [2.0.119] - 2026-05-05

_Release-train alignment with the consuming app — no library changes._

## [2.0.118] - 2026-05-04

_Release-train alignment with the consuming app — no library changes._

## [2.0.117] - 2026-05-04

_Release-train alignment with the consuming app — no library changes._

## [2.0.116] - 2026-05-04

_Release-train alignment with the consuming app — no library changes._

## [2.0.115] - 2026-05-04

_Release-train alignment with the consuming app — no library changes._

## [2.0.114] - 2026-05-04

### Added

- New "liquid-glass" CSS utilities in `styles/theme.css`: `liquid-glass-panel`, `liquid-glass-card`, `liquid-glass-tile`, `liquid-glass-tile-active`. Each ships theme-aware `.light` overrides; tile variants use `color-mix` against the `--foreground` / `--background` tokens. Intended as the shared surface recipe for floating panels (dialogs, popovers, menus), inset cards, and grid tiles.
- `DraggableTableRow`: new optional prop `dragHandleCellIndex`. When set to a valid index into the row's `children`, the dnd-kit drag listeners and ARIA attributes are forwarded onto that single cell instead of the entire row, and `cursor-move` is moved off the row onto the cell. The cell at the index is wrapped via `cloneElement` with its existing `ref` preserved alongside `setActivatorNodeRef`. When the prop is omitted, behavior is unchanged.

### Changed

- `Dialog`, `Popover`, `DropdownMenu`, `DropdownMenuSubContent`: surface class changed from `liquid-glass` to `liquid-glass liquid-glass-panel` so the panel inherits the new shared liquid-glass-panel styling. Text color switched from `text-popover-foreground` to `text-foreground` so the panels read against the new translucent background in both themes.
- `DialogOverlay`: `backdrop-blur-sm` is now always applied (previously only on the `primary` variant via the per-content overlay class). The previous `bg-overlay-transparent` background was dropped — the overlay now relies on `backdrop-blur-sm` alone.
- `DialogContent`: `shadow-lg` is now conditional and only applied on non-`primary` variants — the `liquid-glass-panel` recipe brings its own shadow. `outline-none` added.
- `Sheet`: `primary` variant uses `liquid-glass liquid-glass-panel`. `secondary` keeps `bg-ciGray` but now adds `shadow-lg` explicitly (the base variant no longer hard-codes `shadow-lg`). `SheetOverlay` drops `bg-overlay-transparent` to match `DialogOverlay`.
- `DropdownSelect`: option panel now styled via a dedicated `panelVariantClasses` map (`liquid-glass-panel text-foreground` for both `default` and `dialog` variants) so the panel matches the new Dialog/Popover/Menu surfaces independently of the trigger's `variantClasses`.
- `HourButton`, `MinuteButton`: `dialog` variant restyled. Selected state uses the `primary` token (`bg-primary text-primary-foreground`); unselected state uses a translucent foreground border with `backdrop-blur-sm` (`border-foreground/15 bg-foreground/10 hover:bg-foreground/15`) instead of the previous `bg-white text-foreground dark:bg-accent dark:text-secondary` recipe.
- `Textarea`: solid `border border-accent-light bg-white ... dark:bg-accent` replaced with the shared `liquid-glass-soft` recipe — borderless surface that adapts to theme via the shared utility. `shadow-sm` removed.
- `liquid-glass-soft`: re-tuned with denser opacity and a gradient overlay so it visually anchors `Textarea` against the new panel surfaces.

## [2.0.113] - 2026-05-04

_Release-train alignment with the consuming app — no library changes._

## [2.0.112] - 2026-05-04

_Release-train alignment with the consuming app — no library changes._

## [2.0.111] - 2026-05-04

### Added

- New `CardList<T>` component — a generic, scrollable card list with built-in search (debounced), infinite scroll via `IntersectionObserver`, and multi-select bulk-action support. Renders items via a `renderItem` prop receiving `{ item, isActive, isChecked, onClick, onCheckboxChange }`. Header (`title`, `subtitle`, `actions`) and bulk action bar (`bulkActions`, `onSelectAll`, `onClearSelection`) are optional. Empty / loading states are surfaced via `emptyMessage` and `loadingMessage`. The scroll container uses native `overflow-auto scrollbar-thin` (consistent with the project's tables) so the `IntersectionObserver` sentinel can use the default viewport root. Exports the public types `CardListProps`, `CardListItemProps`, and `CardListHeader`.
- `Input`: new optional prop `leftIcon` accepting a FontAwesome `IconDefinition`. When set, the icon is rendered inside the input on the left and the input automatically receives `pl-9` so the text never overlaps the icon.
- `Input`: new optional prop `onClear`. When set, an `X` button is rendered on the right side of the input as long as the controlled `value` is a non-empty string; clicking it invokes the callback. The input automatically receives `pr-8` to make room for the button.

### Fixed

- `DropdownSelect`: trigger padding (`pl-2.5` / `pr-8`) is now marked `!important` so the new `Input` `leftIcon` / `onClear` padding utilities cannot accidentally override the dropdown trigger geometry when the same base classes are reused.

## [2.0.110] - 2026-05-04

## [2.0.102] - 2026-04-29

### Added

- `DropdownSelect`: new optional prop `enableSearch` (default `true`). When set to `false`, the search input is suppressed even if more than three options are passed; the trigger renders the selected label as a read-only field. Backwards compatible — existing call sites keep the previous "search above 3 options" behavior.
- `DropdownSelect`: new optional prop `enablePortalUsage` (default `true`). When set to `false`, the option panel is rendered inline next to the trigger via CSS absolute positioning (`top-full` / `bottom-full`) instead of being portaled to `document.body` and positioned in viewport coordinates. The viewport-based `openToTop` heuristic still runs so up-opening works in both modes. Intended for embeddings inside a third-party-managed DOM tree (e.g. SurveyJS) where a portal target is unreachable. Backwards compatible — existing call sites keep the previous portal behavior.

### Changed

- `DropdownSelect`: the listbox `id` is now generated via `useId()` instead of the hardcoded `"dropdown-listbox"`. The `aria-controls` attributes on the combobox wrapper and the input now reference the generated id, so screen-reader association stays correct when multiple `DropdownSelect` instances render on the same page.

### Fixed

- `DropdownSelect`: option panel is no longer constructed on every render — `createPortal` and the option list only run while the menu is open.
- `DropdownSelect`: the menu no longer auto-opens on programmatic focus. Previously, when the search input was active (`enableSearch` and more than three options), any focus event — including parent autofocus on mount (e.g. Radix Dialog focusing its first focusable element) or keyboard tab — opened the menu. The trigger now opens only on user click; tab/programmatic focus leaves the menu closed.

## [2.0.101] - 2026-04-29

## [2.0.100] - 2026-04-28

## [2.0.99] - 2026-04-28

## [2.0.98] - 2026-04-27

## [2.0.97] - 2026-04-27

_Release-train alignment with the consuming app — no library changes._

## [2.0.96] - 2026-04-27

_Release-train alignment with the consuming app — no library changes._

## [2.0.95] - 2026-04-24

_Release-train alignment with the consuming app — no library changes._

## [2.0.94] - 2026-04-24

### Added

- `MenuBar`: opt-in integrated search via the new optional `MenuBarConfig.search` field. When provided, a `MenuBarSearchInput` renders below the header and the tree is filtered to matching items. Matching descendants auto-expand their ancestors, and the prior user expansion state is restored byte-identically when the query clears (auto-expansions are merged into a derived set, not into `expandedItems`). When the query has zero results, an empty-state message renders (configurable via `search.noMatchesLabel`, defaults to `"No matches"`). The active route highlight is resolved against the full tree, so it survives searches that hide the active node.
- New `MenuBarSearchInput` component — controlled input with magnifier icon, clear-X button, Escape-to-clear (stops propagation so wrapping dialogs are not closed), and Enter submit forwarding the trimmed query. Exposes `role="searchbox"` and `aria-label` for screen readers.
- New `filterMenuTreeByQuery` utility and `FilterMenuTreeResult` type — recursive, locale-aware case-insensitive substring filter over a `MenuBarConfigItem` tree. Returns the visible subtree plus the set of ancestor ids that must be auto-expanded so a matching descendant is reachable. A self-match keeps all children intact so the user can still drill into the node.
- New `MenuBarSearchConfig` type export.

## [2.0.93] - 2026-04-23

_Release-train alignment with the consuming app — no library changes._

## [2.0.92] - 2026-04-23

### Changed

- `Button`: base shape changed from `rounded-xl` to `rounded-lg` to match the style guide for buttons. Visible on every variant.
- `Input`: `login` variant restyled to use semantic tokens (`bg-background`, `text-foreground`) and an inset focus ring (`ring-2 ring-primary`) instead of a fixed gray border on a white background. The variant now adapts to the active theme — consumers rendering the login screen in dark mode will see theme-aware surface colors and a ring-based focus state instead of the previous border-color change.

### Added

- `Button`: new `xl` size (`h-11 px-8`) for the refreshed login screen.

## [2.0.91] - 2026-04-23

_Release-train alignment with the consuming app — no library changes._

## [2.0.90] - 2026-04-22

_Release-train alignment with the consuming app — no library changes._

## [2.0.89] - 2026-04-21

_Release-train alignment with the consuming app — no library changes._

## [2.0.88] - 2026-04-21

_Release-train alignment with the consuming app — no library changes._

## [2.0.87] - 2026-04-21

### Added

- `LICENSE` and `LICENSE_EXCEPTIONS.md` files shipped with the package.

### Changed

- Package made standalone: publish flow replaced with a sync-based workflow (`sync-ui-kit.yml`). Repository URL in `package.json` updated to the standalone repo.

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
