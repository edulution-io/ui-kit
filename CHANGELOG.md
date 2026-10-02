# Changelog

All notable changes to `@edulution-io/ui-kit` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.0] - 2026-10-02

## [2.2.179] - 2026-10-02

## [2.2.178] - 2026-10-02

### Added

- `SplitPane` accepts `fitLeftSize`, a width the left pane takes for as long as nobody drags the handle, in any CSS
  size the panels accept (`'296px'`, `'20rem'`). The pane follows the value as it changes, so a consumer can size it to
  its content and grow it with that content. Pass `null` while the width is not known yet. Once the prop is set,
  `autoSaveId` stores only widths the user dragged, so a fitted width never comes back as a chosen one, and a dragged
  or stored width wins over the fitted one from then on. The left pane keeps its width in pixels when the window
  changes width, and takes the fitted width back once a window too narrow for it widens again, so a fitted list
  neither truncates nor gains empty space. Without the prop the pane is unchanged.

- `useResizablePanelLayout` accepts a third argument, `{ onlySaveAfterUserInteractions }`, which it hands to
  `useDefaultLayout`, so a layout is stored only when the user resized it. The option's type is taken from
  `useDefaultLayout`, so a react-resizable-panels release that renames or drops it fails the build.

- `useKeyboardInset` returns how many pixels the on-screen keyboard covers at the bottom of the viewport, read from
  `window.visualViewport`, and 0 where the browser has none. It moved here from the edulution-ui frontend, where
  `AdaptiveDialog` already lifts its bottom sheet with it, so kit components can do the same. `keyboardInsetStyle`
  turns that inset into the `bottom` and `maxHeight` a bottom sheet needs, and undefined while no keyboard is open.

- `DropdownSelect` accepts `groupOf`, a function that names the group an option belongs to. The panel then writes that
  name as a heading above the first option of each group, separated from the group above it by a hairline, and wraps
  that group's options in a `role="group"` the heading labels, so a screen reader reads them as one group. The heading
  is drawn over the _filtered_ list, so a search never leaves options standing without the group they belong to, and it
  carries `role="presentation"`, so it is neither selectable nor reachable by keyboard. Without the prop the panel is
  unchanged.

- `DropdownSelect` accepts `searchFromOptionCount`, the number of options from which its search field appears. It
  defaults to 4, which is the threshold the component hard-coded before, so nothing changes for callers that do not
  pass it. A picker whose list is short but whose labels are long can now ask for the field from the first option.

- `Button` accepts `keepsPenPressUncancelled`, which skips the synthesized pen click. A button that doubles as a drag
  surface needs the browser's compatibility mouse press to survive, and cancelling the pen press swallows it.
- `SelectableListRow`: accepts `data-testid`, rendered on the row container.
- `SelectableListRow`: forwards any further `data-*` attribute onto the row container, so a list can mark a row
  with its own state. Props that are not `data-*` are still dropped rather than leaking into the DOM.
- `SelectableListRow`: `onActivate` receives the triggering mouse or keyboard event. The argument is optional, so every
  handler that takes none keeps working; no consumer in this repository reads it yet.
- `WarningBox`: `layout="inline"` renders the box as a single row for toolbars and headers; the default block layout is unchanged.
- `SelectionWizard`: a step-driven selection surface for pick-then-pick flows with any number of steps. With
  `layout="columns"` the steps render side by side as resizable columns on wide screens, in a window of up to
  `maxColumns` (default 3) that slides along with the active step; on narrow screens or with `layout="steps"` one
  step renders at a time, and each step mounts fresh there, so a search typed in one step does not filter the next
  step's list when both render the same component. A step rail in the header shows progress and each step's pick,
  the footer carries cancel, back, next, an optional submit and the active step's secondary action, with cancel
  outlined and every button sized and spaced like the footer of any other dialog, and is left out when it has none of
  them to show. Renders inline, as a
  dialog (`as="dialog"`), or with `as="adaptive"` as that dialog on a wide screen and as a sheet sliding up from the
  bottom below `mobileBreakpointQuery`, where the wizard already shows one step at a time. The sheet rounds its top
  corners with `rounded-t-lg`, like every other dialog. `as="dialog"` stays a dialog
  on every screen, so only callers that ask for the sheet get it. The sheet moves up above the on-screen keyboard, so
  the footer stays in reach while a step's search field has focus. The rendered shell is exposed as `data-shell`
  (`inline`, `dialog` or `sheet`) on the wizard. Inline the title is optional, since the page around it usually
  carries one. With `as="dialog"` or `as="adaptive"` the type requires it, since it names the dialog for a screen
  reader. The rail
  reserves the pick line under every step title (`labels.pickPlaceholder` fills it until a pick arrives), so the
  body below does not jump when a step is picked. A finished step shows its `pickIcon`, the icon of what it
  picked, and falls back to a check mark without one. Every step keeps its title on every screen, and the rail scrolls
  sideways rather than hiding what is coming. State stays with the caller, the kit holds no i18n. An `activeStepId`
  that names no step shows the first step, and the rail, the footer and the columns treat that step as the active one.

### Changed

- `react-resizable-panels` is required at `^4.12.0`. Every desktop `SplitPane` reads the `isUserInteraction` flag that
  4.12 first passes to `onLayoutChanged`, and `useResizablePanelLayout` hands on `onlySaveAfterUserInteractions`, which
  4.11 ignores.

- `DropdownSelect` names every option by its `renderLabel` text rather than by what `renderOption` draws. A row that
  draws only part of the label — the layout name under a room heading, say — was announced by that part alone, so two
  rows differing only in the part left out could not be told apart.

### Fixed

- `SelectableListRow`: Enter and Space now really hand `onActivate` the event, which the entry above had already
  promised while the keyboard path called the handler with no argument. The event reached a handler from a click and
  never from the keyboard.
- `DropdownSelect`: Escape pressed while the focus sits in the field or in its open option list hands the focus back to
  the field once the list is closed, so the next key lands in the field again. With the focus anywhere else the list
  closes and the focus stays where it is. Swallowing the key and clearing a typed search came with 2.2.159.
- `DropdownSelect`: a group keeps its accessible name when the id of its first option contains a space. The heading id
  was built from that option id, and `aria-labelledby` reads a space as the start of a second id.
- `DialogContent` and `SheetContent` stay open when a press outside them lands on an element that is gone by the time
  Radix evaluates it, or that sits in a dialog which is closing. Radix waits for the click before it dismisses a layer,
  so a button in a second dialog that closes its own dialog on that click also dismissed the dialog beneath it. A sheet
  keeps that button on the page while it slides out, which is why the closing dialog counts too. The same holds for a
  pen press, whose click `synthesizePenClick` fires a frame later. A press beside the dialog still closes it, and an
  `onPointerDownOutside` passed by the caller still runs first.

## [2.2.177] - 2026-10-02

## [2.2.176] - 2026-10-02

## [2.2.175] - 2026-10-02

## [2.2.174] - 2026-10-02

## [2.2.173] - 2026-10-02

## [2.2.172] - 2026-10-02

## [2.2.171] - 2026-10-02

### Fixed

- `Badge`: a label longer than the badge's container no longer wraps and spills out of the fixed 36 px height. The
  badge is capped at the width of its container (`max-w-full`), and its text is rendered in a truncating `span` that
  ends in an ellipsis and carries the full text as its `title`. Adjacent text children share one `span`, so a label
  written as `{count} new` keeps its spaces and gets one `title`. Element children, such as a delete button, stay
  next to that `span` and remain visible.

## [2.2.170] - 2026-10-02

## [2.2.169] - 2026-10-02

## [2.2.168] - 2026-10-02

## [2.2.167] - 2026-10-02

## [2.2.166] - 2026-10-02

## [2.2.165] - 2026-10-02

### Changed

- `TabsList` shows a thin scrollbar below the `md` breakpoint, so a tab bar wider than the viewport signals that it
  scrolls. From `md` up the scrollbar stays hidden as before.
- `DropdownSelect` caps its option list at 3.5 option rows (134.75px instead of 125px), so the half row cut off at the
  bottom shows that the list scrolls. `maxMenuHeight` still overrides it.
- `WarningBox` takes `title` as optional and renders no heading without one, for a box whose heading would only
  repeat the title of the dialog around it.

### Fixed

- `Checkbox` draws a dash instead of a check mark while `checked` is `"indeterminate"`, and fills the box like a checked
  one.
- `DraggableTableRow` makes a row with an `onRowClick` focusable (`tabIndex` 0, pointer cursor, focus-visible outline)
  and activates it with Enter or Space when the row itself has focus. Key events from controls inside the row are
  ignored, and a row that is draggable without a drag handle keeps its drag keyboard behaviour. Rows without
  `onRowClick` are unchanged.
- `DropdownSelect` no longer shows its read-only trigger text as selected when the trigger receives focus. With three
  options or fewer the trigger holds the selected label or the placeholder as its value, and a dialog that focuses its
  first field (Radix `FocusScope` focuses and then calls `select()`) left that text highlighted in the system selection
  colour. The trigger now collapses the selection right after it gains focus; the searchable trigger keeps its query
  selection as before.

## [2.2.164] - 2026-10-02

## [2.2.163] - 2026-10-02

## [2.2.162] - 2026-10-02

## [2.2.161] - 2026-10-02

## [2.2.160] - 2026-10-02

## [2.2.159] - 2026-10-02

### Added

- `useEscapeCapture(isActive, onEscape)`: swallows `Escape` while a floating panel is open, so only that panel closes
  and a surrounding dialog stays open. Radix's `DismissableLayer` listens on the document in the capture phase, so a
  panel that is not itself a Radix layer lets the keypress through; this listens one step higher, on the window in the
  same phase. `onEscape` is read through a ref, so an unstable callback does not re-register the listener.

### Fixed

- `DropdownSelect` swallows `Escape` while its option list is open, so the keypress closes only the list and a
  surrounding dialog stays open with its entered input intact. Every dialog hosting a `DropdownSelect` previously read
  the keypress as a close request. A second `Escape` reaches the dialog and closes it as before.
- The published package now ships the type declarations for its hooks. `files` listed `components`, `constants`,
  `styles` and `utils` but not `hooks`, so `index.d.ts` re-exported `./hooks/*` declarations the tarball never
  carried and an external TypeScript consumer could not resolve `useOnClickOutside`, `useMediaQuery`,
  `useCenterScroll`, `useElementWidth`, `usePopoverOutsideDismiss` or `useEscapeCapture`.
- `DateTimePicker` swallows `Escape` while its field is in text-entry mode, so the keypress cancels the edit and a
  surrounding dialog stays open with its entered input intact. The field handled `Escape` through a React `onKeyDown`,
  which runs after Radix's document-level capture listener and so could not stop the dialog from closing. A second
  `Escape` reaches the dialog and closes it as before. Editing an hour or minute segment inside the popover swallows
  `Escape` the same way, so the first keypress cancels that edit, the second closes the popover and the third closes
  the dialog.
- `MenuBarSearchInput` swallows `Escape` through `useEscapeCapture` while its field is focused and holds a query, so the
  keypress clears the query and a surrounding dialog stays open. It handled `Escape` through a React `onKeyDown`, whose
  `stopImmediatePropagation` runs at the React root in the bubble phase — after Radix's document-level capture listener
  — so it could not stop the dialog from closing. `Escape` with an empty field now propagates instead of being
  swallowed, so the surrounding layer closes on the second press as it does for the other panels.
- `DateTimePicker` commits a field edit made after an earlier one was cancelled with `Escape`. Cancelling armed an
  internal guard against the `blur` that follows the input being torn down; that `blur` never fires, so the guard
  survived and silently discarded the next commit, leaving the field stuck in text-entry mode. The guard is gone —
  tearing the input down ends the edit on its own.
- Typing into a `DropdownSelect`'s search filter reopens the option list, so the text filters the options instead of
  sitting in a trigger with no list under it. `Escape` closes the list without blurring the field, and typing from
  there only wrote the filter; the list stayed closed and the next click on the field discarded what was typed.
- Clicking into a `DropdownSelect`'s search filter while its option list is open keeps the typed text. Every click on
  the field cleared the filter, so moving the caret with the mouse emptied it and listed all options again.
- A `DropdownSelect` closes its option list when focus leaves it, so no more than one list is open at a time. Typing
  into a search filter opens its list, and tabbing on to the next dropdown and typing there left both open; the first
  list swallowed the next `Escape`, which then closed the list the user had already left instead of the one being
  typed into.
- Closing a `DropdownSelect`'s option list without picking an option — by `Escape` or by a click outside — discards any
  text typed into the search filter, so the trigger shows the current selection again. It previously kept the abandoned
  query on display while `selectedVal` was unchanged, so a search-enabled dropdown read as though the typed text were
  the selection.

## [2.2.158] - 2026-10-01

## [2.2.157] - 2026-10-01

## [2.2.156] - 2026-10-01

## [2.2.155] - 2026-10-01

## [2.2.154] - 2026-09-30

## [2.2.153] - 2026-09-30

## [2.2.152] - 2026-09-30

### Changed

- `SectionCard`: a card given an `onClick` is now keyboard operable — it takes `tabIndex={0}`, activates on Enter and Space, and renders with `cursor-pointer` and a focus-visible ring. Callers that painted the pointer cursor by hand can drop it. A card without `onClick` stays out of the tab order, a caller-supplied `tabIndex` wins, an `onKeyDown` runs first and suppresses the card's own activation by calling `preventDefault()`, and a key press on a control inside the card no longer reaches the card's own handler. No `role="button"` is set, since the cards carry their own buttons and a `button` role may not contain interactive descendants.

## [2.2.151] - 2026-09-30

## [2.2.150] - 2026-09-30

## [2.2.149] - 2026-09-30

## [2.2.148] - 2026-09-28

## [2.2.147] - 2026-09-28

## [2.2.146] - 2026-09-25

## [2.2.145] - 2026-09-25

## [2.2.144] - 2026-09-25

## [2.2.143] - 2026-09-25

## [2.2.142] - 2026-09-25

## [2.2.141] - 2026-09-24

## [2.2.140] - 2026-09-24

## [2.2.139] - 2026-09-24

## [2.2.138] - 2026-09-24

## [2.2.137] - 2026-09-24

## [2.2.136] - 2026-09-24

## [2.2.135] - 2026-09-24

## [2.2.134] - 2026-09-24

## [2.2.133] - 2026-09-23

## [2.2.132] - 2026-09-23

## [2.2.131] - 2026-09-23

## [2.2.130] - 2026-09-23

### Added

- `MenuBarConfigItem.excludeFromBadgeAggregation`: an item marked with it keeps showing its own badge but its own badge is left out of a collapsed parent's aggregated badge. Its children still count unless they opt out themselves.

## [2.2.129] - 2026-09-23

## [2.2.128] - 2026-09-23

## [2.2.127] - 2026-09-22

## [2.2.126] - 2026-09-22

## [2.2.125] - 2026-09-22

## [2.2.124] - 2026-09-22

## [2.2.123] - 2026-09-22

## [2.2.122] - 2026-09-22

## [2.2.121] - 2026-09-22

## [2.2.120] - 2026-09-22

## [2.2.119] - 2026-09-22

## [2.2.118] - 2026-09-22

## [2.2.117] - 2026-09-22

## [2.2.116] - 2026-09-22

## [2.2.115] - 2026-09-22

## [2.2.114] - 2026-09-21

## [2.2.113] - 2026-09-21

## [2.2.112] - 2026-09-21

## [2.2.111] - 2026-09-21

## [2.2.110] - 2026-09-21

## [2.2.109] - 2026-09-21

## [2.2.108] - 2026-09-21

### Changed

- **BREAKING** `Calendar` now builds on `react-day-picker` v9. The `classNames` keys follow the v9 vocabulary
  (`month_caption`, `month_grid`, `weekdays`, `weekday`, `week`, `day`, `day_button`, `button_previous`,
  `button_next`, `selected`, `today`, `outside`, `disabled`, `range_start`, `range_middle`, `range_end`, `hidden`),
  and the chevron icons are supplied through a single `Chevron` component instead of `IconLeft`/`IconRight`.
  Modifier classes such as `selected` are applied to the day cell (`<td>`) rather than the day button, and
  `aria-selected` now sits on that cell too — a `classNames` override that reached the selected day through
  `[&:has([aria-selected])]` in v8 has to target the cell directly. `selected`, `today` and `range_middle` style
  the day button through `[&>button]:`, so the highlight keeps the button's rounded shape. Because those variants
  all compile to the same `0-1-1` specificity, `range_middle` marks its colours `!important` and `outside` reaches
  the button through `[&[aria-selected]>button]:` — v8 let `aria-selected:` outrank a bare utility on specificity
  alone, and an override that relies on emission order to beat `selected` will not win in v9.
- **BREAKING** `CalendarDropdownCaption` is now a `MonthCaption` component. Pass it as
  `components={{ MonthCaption: CalendarDropdownCaption }}` with `hideNavigation`, and bound the year dropdown with
  `startMonth`/`endMonth` instead of `fromYear`/`toYear`, which v10 removes.
- `CalendarDropdownCaption` falls back to `en-US` month names when the calendar is given no `locale`. In v8 the
  library resolved that default itself; v9 leaves `locale` unset, which would otherwise format month names with
  the browser's locale.

### Fixed

- `Calendar` styles a selected range again. `aria-selected` sits on the day cell in v9, so the `:has([aria-selected])`
  selectors inherited from v8 matched nothing and a range rendered without its accent band or its rounded ends.
  `range_start` and `range_end` now carry their own caps, which also stops v9 emitting an unstyled `rdp-range_start`
  fallback class on the first day of a range.
- `CalendarDropdownCaption` bounds its year dropdown with the deprecated `fromYear`/`toYear`/`fromMonth`/`toMonth`
  as well, matching what react-day-picker still honours for its own navigation. It read `startMonth`/`endMonth` off
  `dayPickerProps`, which is the raw props object: v9 resolves the deprecated props inside `getNavMonths` and never
  writes the result back, so a calendar still wired up the v8 way offered only the displayed year and no way to
  jump. Upgrading steers a consumer straight into it — v9's `CustomComponents` has no `Caption` key, so the
  `components` line fails to compile and gets fixed while `fromYear`/`toYear` beside it stay silently valid.
  `getNavMonths` is not exported, so the fallback is duplicated; it can go when v10 drops the deprecated props.
- `CalendarDropdownCaption` applies the `className`, `style` and `data-animated-caption` that v9 hands a custom
  `MonthCaption`. It read `calendarMonth` only and hardcoded its root class, so `classNames={{ month_caption }}`,
  `styles={{ month_caption }}` and the animation hook were all dropped without an error or a warning —
  `MonthCaptionProps` is `{ calendarMonth; displayIndex } & HTMLAttributes<HTMLDivElement>` and the library's own
  default spreads everything it does not consume onto its root `div`. In v8 a replacement caption owned its class,
  so this contract changed underneath the component while its shape stayed the same.
- `Calendar` merges a consumer's `components` with its own instead of being replaced by it. `components` arrived
  through the trailing prop spread, so `components={{ MonthCaption }}` discarded the FontAwesome `Chevron` and fell
  back to react-day-picker's own icon.
- `Calendar` no longer imposes its `month_caption` base on a custom `MonthCaption`. That base centres
  react-day-picker's built-in caption, and once the caption above began honouring `className` its `justify-center`
  would have overridden a replacement caption's own layout. An explicit `classNames={{ month_caption }}` from a
  consumer still wins, as it always did — it replaces the base outright.
- `Calendar` styles react-day-picker's own `captionLayout="dropdown"`. The `dropdowns`, `dropdown_root` and `dropdown`
  parts carried no classes, and the library ships no stylesheet of its own here, so each `<select>` rendered _beside_
  the `<span>` holding the same value instead of invisibly on top of it. The caption came out roughly twice as wide as
  its text, which pushed the month dropdown under the previous-month button — measured in a browser, the leftmost
  ~16px of that dropdown resolved to the nav button, so clicking it navigated instead of opening the menu. The three
  parts now mirror upstream (`position: absolute; inset: 0; opacity: 0` over a `relative` root), which restores the
  intended look, returns the calendar to the same width as one with the default caption, and makes both dropdowns
  hit-testable across their whole rect. In-repo consumers pass their own `MonthCaption` and never rendered these parts.
- `Calendar` no longer announces hardcoded English to screen readers. v9 puts an `aria-label` on every day button
  and builds it as `Today, {date}` / `{date}, selected` (and `Today, {date}` on the gridcell of a non-interactive
  calendar); the date goes through the locale but the literals do not, and `getLabels` only consults `props.labels`
  and `locale.labels`, which date-fns locales do not carry. The package now defaults `labelDayButton` and
  `labelGridcell` to the localized date alone, merged per key so a consumer's `labels` still wins key by key. Pass
  `labelDayButton` to convey "today" in your own language; selection is already announced from the cell's
  `aria-selected`. v8 never applied `labelDay`, so its day buttons carried no `aria-label` at all.
- `DateTimePicker` accepts `calendarLabels` to reach the calendar's `labels`, matching how it already takes
  `monthLabel`, `previousMonthLabel` and the other translated strings from its consumer.
- `Calendar` keeps react-day-picker's own `captionLayout="dropdown"` usable. `nav` is a full-width absolute overlay
  (`inset-x-0`) above the caption in v9, so it covered the centred month and year dropdowns and swallowed every
  click aimed at them; upstream avoids this by keeping `.rdp-nav` content-width and right-aligned. The bar is now
  `pointer-events-none` with `pointer-events-auto` on the two nav buttons, so its empty middle passes clicks
  through. Both in-repo consumers pass `hideNavigation` and were unaffected.
- `Calendar` dims the middle of a range and a selected outside day again. Both were styled by `[&>button]:` variants
  of the same specificity as `selected`, so Tailwind's emission order decided the winner and `bg-primary` painted
  every day of a range solid; the outside day's cell background was additionally covered by the button, which fills
  the cell exactly. `range_middle` and `outside` now outrank `selected` instead of tying with it.

## [2.2.107] - 2026-09-21

## [2.2.106] - 2026-09-21

## [2.2.105] - 2026-09-18

## [2.2.104] - 2026-09-18

### Changed

- License notices: every source file now carries a short SPDX header — the copyright line (`Copyright (C) 2024-2026 Netzint GmbH`), the SPDX expression (`SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial`) and a pointer to `LICENSE` and `LICENSES/` — instead of the 18-line prose block. The dual license itself is unchanged. The package now ships `LICENSES/` with the full text of both licenses, and the README states the dual license instead of naming the AGPL alone.

## [2.2.103] - 2026-09-18

## [2.2.102] - 2026-09-18

## [2.2.101] - 2026-09-18

## [2.2.100] - 2026-09-18

## [2.2.99] - 2026-09-17

## [2.2.98] - 2026-09-17

## [2.2.97] - 2026-09-17

## [2.2.96] - 2026-09-17

## [2.2.95] - 2026-09-17

## [2.2.94] - 2026-09-17

## [2.2.93] - 2026-09-17

## [2.2.92] - 2026-09-17

## [2.2.91] - 2026-09-17

## [2.2.90] - 2026-09-17

## [2.2.89] - 2026-09-17

## [2.2.88] - 2026-09-17

## [2.2.87] - 2026-09-17

## [2.2.86] - 2026-09-17

## [2.2.85] - 2026-09-16

## [2.2.84] - 2026-09-16

## [2.2.83] - 2026-09-16

## [2.2.82] - 2026-09-16

## [2.2.81] - 2026-09-16

## [2.2.80] - 2026-09-16

## [2.2.79] - 2026-09-16

## [2.2.78] - 2026-09-16

### Fixed

- `SectionCard`'s JSDoc no longer advertises props the component does not have. It described an optional `footer` action area, a `divided` prop separating header, body and footer with a `Separator`, a `selected` prop rendering a primary-coloured selection ring, and "footer bases" among the class strings `SECTION_CARD_STYLES` exposes. None of the three props exist on `SectionCardProps` and the styles record has no footer entry, so a consumer writing `<SectionCard footer={…} divided />` from the documented API got a compile error. The comment now describes what the component actually accepts: `header` takes precedence over `label` (a string `label` renders as an `h3`), `bordered={false}` drops the surface border, `withBackground={false}` forces a transparent unblurred surface, `surfaceId` sets the `<section>` id while `id` triggers the `AnchorSection` wrap, `bodyClassName` extends the body class string while `headerClassName` extends only the header generated from `label` (a custom `header` node is rendered as-is), the body drops its top padding automatically under a header, and remaining props are spread onto the `<section>`. It also states that the body always carries `text-sm`, so content needing the default body size must set its own.

## [2.2.77] - 2026-09-16

## [2.2.76] - 2026-09-16

## [2.2.75] - 2026-09-14

## [2.2.74] - 2026-09-14

## [2.2.73] - 2026-09-14

## [2.2.72] - 2026-09-11

## [2.2.71] - 2026-09-11

## [2.2.70] - 2026-09-11

## [2.2.69] - 2026-09-11

## [2.2.68] - 2026-09-11

## [2.2.67] - 2026-09-10

## [2.2.66] - 2026-09-10

## [2.2.65] - 2026-09-10

## [2.2.64] - 2026-09-10

## [2.2.63] - 2026-09-09

### Fixed

- `TableHead` was transparent, so rows scrolling under the sticky header collided with the column labels. It relied on `backdrop-blur-md`, which cannot work there: the table sits inside a `liquid-glass` surface, and `backdrop-filter` on that surface makes it a backdrop root, which a nested backdrop filter never sees past. The header now paints an opaque `bg-accent` on every table, dialog-hosted ones included, so the treatment is the same everywhere. A translucent frosted header is deliberately not part of this change — it needs a layer that escapes the table's containing block, which is tracked separately in [edulution-io/edulution-ui#3592](https://github.com/edulution-io/edulution-ui/issues/3592).
- The 1px divider under the sticky table header used `bg-muted`, which sits at 1.15:1 against the new `bg-accent` fill in dark and is invisible there. It now uses `bg-muted-foreground/20`, which separates in both themes without reading as a hard rule — 1.54:1 dark, 1.30:1 light.

## [2.2.62] - 2026-09-09

## [2.2.61] - 2026-09-09

## [2.2.60] - 2026-09-09

## [2.2.59] - 2026-09-09

## [2.2.58] - 2026-09-08

## [2.2.57] - 2026-09-08

### Fixed

- `DraggableTableRow` no longer puts dnd-kit's drag attributes on any row or drag handle cell. dnd-kit derives `role="button"`, `tabIndex=0`, `aria-disabled`, `aria-roledescription="draggable"` and `aria-describedby` from the draggable's `disabled` flag and emits them unconditionally, so a table rendered with `enableDragAndDrop` off announced every row as a disabled button, made each row a dead tab stop, and propagated the disabled state to the controls inside the row. The row and the drag handle cell now take only dnd-kit's activation listeners, which the library already withholds when dragging is disabled. `role="button"` is no longer placed on a `<tr>` at all: it is not a valid role for a table row, it removes the row from the table's accessibility tree, and — with no keyboard sensor registered — the `tabIndex` and drag instructions it brought advertised a keyboard drag that could never be performed. Dragging with a pointer is unaffected. A row disabled via `isRowDisabled` keeps its `data-disabled` marker, and now carries `aria-disabled="true"` when it has no `onRowClick`. The attribute is withheld from a clickable row because that state applies to the row's focusable descendants as well -- the same propagation this fix removes -- and such a row still holds operable controls; it conveys its state through those controls instead, so the caller must render them disabled.
- `DraggableTableRow`'s JSDoc now states the `isRowDisabled` contract: it suppresses dragging, sets `data-disabled`, and sets `aria-disabled` only on a row with no `onRowClick`, because that state applies to the row's focusable descendants as well; a disabled row that stays clickable therefore has no accessible disabled state of its own and the caller must render the row's own interactive controls disabled.

## [2.2.56] - 2026-09-08

### Changed

- `Input`: a cleared `type="number"` field now reports the empty string rather than `0`. The coercion ran before the caller saw the event, so emptying a numeric field looked identical to typing zero and callers had no way to tell the two apart — a cleared timeout silently became `0`. Typing a number is unchanged.

### Added

- `DropdownSelect`: new optional `renderOption`, which replaces the text of a single entry in the open menu with arbitrary content while `renderLabel` keeps governing the trigger and the search. Entries that carry a picture — an icon list, a colour swatch, an avatar — had no way to show it and had to be rebuilt as a bespoke menu. Additive and unset by default, so existing callers render exactly as before. The JSDoc on the public export now describes it alongside `renderLabel`, and says which of the two governs the trigger and the search.

## [2.2.55] - 2026-09-08

## [2.2.54] - 2026-09-08

## [2.2.53] - 2026-09-08

## [2.2.52] - 2026-09-08

## [2.2.51] - 2026-09-08

## [2.2.50] - 2026-09-08

## [2.2.49] - 2026-09-08

## [2.2.48] - 2026-09-08

## [2.2.47] - 2026-09-07

## [2.2.46] - 2026-09-07

## [2.2.45] - 2026-09-03

## [2.2.44] - 2026-09-03

## [2.2.43] - 2026-09-03

## [2.2.42] - 2026-09-03

## [2.2.41] - 2026-09-03

## [2.2.40] - 2026-09-02

## [2.2.39] - 2026-09-02

## [2.2.38] - 2026-09-01

## [2.2.37] - 2026-09-01

## [2.2.36] - 2026-09-01

## [2.2.35] - 2026-08-31

## [2.2.34] - 2026-08-25

## [2.2.33] - 2026-08-24

## [2.2.32] - 2026-08-24

## [2.2.31] - 2026-08-24

## [2.2.30] - 2026-08-24

## [2.2.29] - 2026-08-24

## [2.2.28] - 2026-08-24

## [2.2.27] - 2026-08-24

## [2.2.26] - 2026-08-24

## [2.2.25] - 2026-08-24

## [2.2.24] - 2026-08-21

### Added

- `StatValue`: new `sm` size, sitting below the existing `md` and `lg` (`text-lg` value, `text-sm` secondary). Dense tile layouts that place several stats side by side had no size small enough and had to override the classes. Additive — existing callers are unchanged. The JSDoc on the public export documents all three sizes and what each is for.

## [2.2.23] - 2026-08-21

## [2.2.22] - 2026-08-21

## [2.2.21] - 2026-08-20

## [2.2.20] - 2026-08-20

## [2.2.19] - 2026-08-20

## [2.2.18] - 2026-08-20

## [2.2.17] - 2026-08-20

## [2.2.16] - 2026-08-19

## [2.2.15] - 2026-08-19

## [2.2.14] - 2026-08-19

## [2.2.13] - 2026-08-18

## [2.2.12] - 2026-08-18

## [2.2.11] - 2026-08-17

## [2.2.10] - 2026-08-17

## [2.2.9] - 2026-08-17

## [2.2.8] - 2026-08-11

## [2.2.7] - 2026-08-11

## [2.2.6] - 2026-08-11

## [2.2.5] - 2026-08-10

## [2.2.4] - 2026-08-10

## [2.2.3] - 2026-08-10

## [2.2.2] - 2026-08-10

## [2.2.1] - 2026-08-10

## [2.2.0] - 2026-08-07

## [2.1.65] - 2026-08-07

## [2.1.64] - 2026-08-07

## [2.1.63] - 2026-08-07

## [2.1.62] - 2026-08-07

## [2.1.61] - 2026-08-07

## [2.1.60] - 2026-08-07

## [2.1.59] - 2026-08-07

## [2.1.58] - 2026-08-07

## [2.1.57] - 2026-08-07

## [2.1.56] - 2026-08-07

## [2.1.55] - 2026-08-07

## [2.1.54] - 2026-08-07

## [2.1.53] - 2026-08-07

## [2.1.52] - 2026-08-07

## [2.1.51] - 2026-08-07

## [2.1.50] - 2026-08-07

## [2.1.49] - 2026-08-07

## [2.1.48] - 2026-08-07

## [2.1.47] - 2026-08-07

## [2.1.46] - 2026-08-07

## [2.1.45] - 2026-08-07

## [2.1.44] - 2026-08-06

## [2.1.43] - 2026-08-06

## [2.1.42] - 2026-08-06

## [2.1.41] - 2026-08-06

## [2.1.40] - 2026-08-06

## [2.1.39] - 2026-08-06

## [2.1.38] - 2026-08-06

## [2.1.37] - 2026-08-06

## [2.1.36] - 2026-08-06

## [2.1.35] - 2026-08-06

## [2.1.34] - 2026-08-05

## [2.1.33] - 2026-08-05

### Added

- `InputWithActionIcons`: `ActionIcon` accepts an optional `label`, rendered as the icon button's `aria-label`. Without it an icon-only action button has no accessible name and is announced as a bare "button". Additive — existing callers are unchanged.

## [2.1.32] - 2026-08-05

## [2.1.31] - 2026-08-04

## [2.1.30] - 2026-08-04

## [2.1.29] - 2026-08-04

## [2.1.28] - 2026-08-04

## [2.1.27] - 2026-08-04

## [2.1.26] - 2026-08-04

## [2.1.25] - 2026-08-03

## [2.1.24] - 2026-07-31

## [2.1.23] - 2026-07-30

## [2.1.22] - 2026-07-30

## [2.1.21] - 2026-07-30

### Fixed

- `Checkbox` derived its DOM `id` (and its `<label for>`) from the `label` string, so two checkboxes sharing a label collided on one id and a label click could toggle the wrong one. The id is now generated with `useId()` and can be pinned by passing an explicit `id`.

## [2.1.20] - 2026-07-30

## [2.1.19] - 2026-07-30

## [2.1.18] - 2026-07-29

## [2.1.17] - 2026-07-29

### Changed

- Build against TypeScript 6.0.3

### Fixed

- Declare the CSS side-effect imports so the package type-checks under TypeScript 6

## [2.1.16] - 2026-07-29

## [2.1.15] - 2026-07-29

## [2.1.14] - 2026-07-29

## [2.1.13] - 2026-07-29

## [2.1.12] - 2026-07-23

## [2.1.11] - 2026-07-23

## [2.1.10] - 2026-07-23

## [2.1.9] - 2026-07-23

## [2.1.8] - 2026-07-23

## [2.1.7] - 2026-07-23

## [2.1.6] - 2026-07-22

## [2.1.5] - 2026-07-22

## [2.1.4] - 2026-07-22

## [2.1.3] - 2026-07-22

## [2.1.2] - 2026-07-21

## [2.1.1] - 2026-07-20

## [2.1.0] - 2026-07-17

## [2.0.404] - 2026-07-17

## [2.0.403] - 2026-07-17

## [2.0.402] - 2026-07-17

## [2.0.401] - 2026-07-17

## [2.0.400] - 2026-07-17

## [2.0.399] - 2026-07-17

## [2.0.398] - 2026-07-17

## [2.0.397] - 2026-07-17

## [2.0.396] - 2026-07-17

## [2.0.395] - 2026-07-17

## [2.0.394] - 2026-07-17

## [2.0.393] - 2026-07-17

## [2.0.392] - 2026-07-17

## [2.0.391] - 2026-07-17

## [2.0.390] - 2026-07-17

### Added

- New `usePopoverOutsideDismiss` hook — closes a controlled radix `Popover` on a pointer down outside its anchor. Radix defers its own outside dismiss to the click event and skips it when that click opens another modal layer, which leaves the popover open on top of the new layer; this dismisses on pointer down instead. Pointer downs inside any popper content are ignored, so nested poppers (dropdowns, selects) keep working.

### Fixed

- `DateTimePicker` now closes its popover on a pointer down outside the field, via `usePopoverOutsideDismiss`. It previously relied solely on radix's outside dismiss, so the popover stayed open on top of a confirmation dialog opened from the surrounding dialog's footer. An hour or minute segment being edited when the popover is dismissed commits its typed value. The calendar, the time lists and the month and year dropdowns are unaffected.
- `DateTimePicker` now closes when its trigger is clicked a second time. The single-click open timer read the open state after radix had already dismissed the popover, and reopened it 180 ms later. Activating the trigger with Enter or Space toggles the popover the same way.

## [2.0.389] - 2026-07-17

## [2.0.388] - 2026-07-17

## [2.0.387] - 2026-07-17

## [2.0.386] - 2026-07-17

## [2.0.385] - 2026-07-17

## [2.0.384] - 2026-07-17

## [2.0.383] - 2026-07-17

## [2.0.382] - 2026-07-16

## [2.0.381] - 2026-07-16

## [2.0.380] - 2026-07-16

## [2.0.379] - 2026-07-16

## [2.0.378] - 2026-07-16

## [2.0.377] - 2026-07-16

## [2.0.376] - 2026-07-16

## [2.0.375] - 2026-07-16

## [2.0.374] - 2026-07-16

## [2.0.373] - 2026-07-16

## [2.0.372] - 2026-07-15

## [2.0.371] - 2026-07-15

## [2.0.370] - 2026-07-14

### Added

- New `CircularProgress` component — a determinate circular progress ring (`value` 0..1) for gauges such as context-window usage. Extracted from the AI usage popover's inline SVG so the ring is reusable.
- New `SelectableListRow` component — the shared selectable list-row shell for `CardList` items. It owns the full-width selection/hover background (so it spans the leading checkbox and trailing action menu, not just the content), the leading/content/trailing slot layout, and optional row-level click + keyboard activation. Two selection looks via `variant`: `surface` and `accentRail`. The mail message list and the chat conversation list now share it instead of each re-styling the row.
- `MenuBarConfigItem` now supports an optional `groupLabel`. Consecutive top-level items sharing the same `groupLabel` form a visual section: the first item of each group renders an uppercase header (with a separator above every group after the first), so a single menu can be split into labelled sections.

### Changed

- `CardList` header/selection dividers and the `ResizableHandle` divider now use the neutral `accent-light` border instead of the blue-tinted `muted`, so list separators and pane handles read as a consistent neutral grey across surfaces.

## [2.0.369] - 2026-07-14

## [2.0.368] - 2026-07-14

## [2.0.367] - 2026-07-14

### Added

- `CalendarDropdownCaption`: a drop-in `Caption` component for `Calendar`. Pass it via `components={{ Caption: CalendarDropdownCaption }}` together with `fromYear`/`toYear` to replace the plain month/year label with month and year dropdowns plus previous/next month buttons. Reads its accessible names from the DayPicker `labels`.

### Changed

- The month/year dropdown header used by `DateTimePicker` was extracted into a shared `MonthYearSelect` component, now reused by `CalendarDropdownCaption`. No public API changes to `DateTimePicker`.
- The month and year dropdown option builders shared by `DateTimePicker` and `CalendarDropdownCaption` were extracted into internal `buildMonthOptions`/`buildYearOptions` utilities. No public API or behaviour changes.

### Removed

- **BREAKING:** `MenuBarItemAction.isDestructive`. `MenuBarItemActions` no longer applies `text-destructive` styling to an action. Destructive intent is conveyed by a confirmation dialog rather than by colour. Consumers passing `isDestructive` must drop the property.

## [2.0.366] - 2026-07-14

## [2.0.365] - 2026-07-14

## [2.0.364] - 2026-07-13

## [2.0.363] - 2026-07-10

## [2.0.362] - 2026-07-09

## [2.0.361] - 2026-07-09

## [2.0.360] - 2026-07-09

## [2.0.359] - 2026-07-09

## [2.0.358] - 2026-07-09

## [2.0.357] - 2026-07-09

## [2.0.356] - 2026-07-09

## [2.0.355] - 2026-07-09

## [2.0.354] - 2026-07-09

## [2.0.353] - 2026-07-09

## [2.0.352] - 2026-07-08

## [2.0.351] - 2026-07-08

## [2.0.350] - 2026-07-08

## [2.0.349] - 2026-07-08

## [2.0.348] - 2026-07-07

## [2.0.347] - 2026-07-07

## [2.0.346] - 2026-07-07

## [2.0.345] - 2026-07-07

## [2.0.344] - 2026-07-07

## [2.0.343] - 2026-07-07

## [2.0.342] - 2026-07-06

### Changed

- React 19 support: the `react`/`react-dom` dev/build targets and the `@types/react`/`@types/react-dom` dev dependencies were bumped to 19, and `cmdk`/`qrcode.react` were bumped to their React 19-compatible majors. The `>=18.0.0` `peerDependencies` ranges are unchanged, so React 18 consumers remain supported. Component ref types widened to `RefObject<T | null>` in line with the React 19 type definitions; no public API changes.

## [2.0.341] - 2026-07-03

## [2.0.340] - 2026-07-03

## [2.0.339] - 2026-07-03

## [2.0.338] - 2026-07-02

## [2.0.337] - 2026-07-02

## [2.0.336] - 2026-07-02

## [2.0.335] - 2026-07-02

## [2.0.334] - 2026-07-02

## [2.0.333] - 2026-07-02

## [2.0.332] - 2026-07-02

## [2.0.331] - 2026-07-02

## [2.0.330] - 2026-07-01

### Added

- New `DateTimePicker` component — a controlled date/time picker with a `date` / `time` / `datetime` `mode`, compact month and year dropdown menus (instead of native `<select>` elements) that open scrolled to the currently selected value, wheel/touchpad-scrollable time lists and double-click editing of the hour/minute values. Exposes `DATETIME_PICKER_MODES` / `TDateTimePickerMode`.
- `DateTimePicker` field now supports direct text entry: a single click opens the calendar/time popover, while a double-click on the field turns it into a text input for typing the date and time directly (locale-aware mask, e.g. `dd.MM.yyyy HH:mm`). `Enter` commits, `Escape` cancels, and an unparseable entry is discarded without changing the value.
- `DateTimePicker` now accepts `previousMonthLabel` and `nextMonthLabel` props to give the icon-only month-navigation buttons accessible names.
- `normalizeWheelDelta` is now exported from the package — a helper that normalizes a wheel event's `deltaY` to pixels regardless of its `deltaMode` (pixel, line or page), for consistent wheel/touchpad scrolling.

### Fixed

- `DateTimePicker` double-click time editing now accepts a full two-digit hour/minute. The edit field re-selected its content on every keystroke, so each typed digit replaced the previous one — focus and selection now happen once when editing starts.

## [2.0.329] - 2026-07-01

## [2.0.328] - 2026-07-01

## [2.0.327] - 2026-07-01

## [2.0.326] - 2026-07-01

## [2.0.325] - 2026-07-01

## [2.0.324] - 2026-07-01

## [2.0.323] - 2026-07-01

## [2.0.322] - 2026-06-30

## [2.0.321] - 2026-06-30

## [2.0.320] - 2026-06-30

## [2.0.319] - 2026-06-30

## [2.0.318] - 2026-06-30

## [2.0.317] - 2026-06-30

## [2.0.316] - 2026-06-30

### Added

- New `btn-icon-tile` Button variant — a chromeless, transparent icon tile (no padding, a 2px transparent border that turns `border-secondary` on hover) for dense icon-grid selectors. Like `btn-ghost` and `btn-window-control`, it supplies its own sizing, so the default `h-16` size classes are skipped.

## [2.0.315] - 2026-06-30

## [2.0.314] - 2026-06-30

## [2.0.313] - 2026-06-30

## [2.0.312] - 2026-06-29

## [2.0.311] - 2026-06-29

## [2.0.310] - 2026-06-29

## [2.0.309] - 2026-06-29

## [2.0.308] - 2026-06-29

## [2.0.307] - 2026-06-29

## [2.0.306] - 2026-06-29

## [2.0.305] - 2026-06-26

## [2.0.304] - 2026-06-26

## [2.0.303] - 2026-06-25

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
