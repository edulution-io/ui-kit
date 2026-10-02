/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * Accordion – A collapsible content panel built on Radix UI Accordion primitive.
 */
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/Accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './components/Accordion';

/**
 * Avatar – A user avatar component built on Radix UI Avatar primitive with image and fallback support.
 */
export { Avatar, AvatarImage, AvatarFallback } from './components/Avatar';
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps } from './components/Avatar';

/**
 * Badge – A styled label component with variant support for status indicators and tags. It has a fixed height and
 * never grows past its container: text children are truncated with an ellipsis and keep the full text as `title`.
 */
export { Badge, badgeVariants } from './components/Badge';
export type { BadgeProps, BadgeVariant } from './components/Badge';

/**
 * Chip – A compact, clickable inline chip/tag button (e.g. for copyable values like email addresses).
 */
export { Chip, chipVariants } from './components/Chip';
export type { ChipProps, ChipVariant } from './components/Chip';

/**
 * DropdownMenu – A dropdown menu built on Radix UI DropdownMenu primitive.
 */
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/DropdownMenu';
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
} from './components/DropdownMenu';

/**
 * Command – A command palette component built on cmdk with search input and item groups.
 */
export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './components/Command';
export type {
  CommandProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandItemProps,
  CommandSeparatorProps,
  CommandShortcutProps,
} from './components/Command';

/**
 * Button – A customizable button component with multiple style variants.
 */
export { Button, buttonVariants } from './components/Button';
export type { ButtonProps, ButtonVariant } from './components/Button';

/**
 * Input – A styled text input with variant support and consistent theming.
 *
 * Variants: `default`, `dialog`, `login`, `lightGrayDisabled`.
 *
 * The `login` variant is tuned for the login screen and renders focus as an
 * inset ring (`ring-2 ring-primary`) instead of a border color change. It uses
 * semantic tokens (`bg-background`, `text-foreground`) so it adapts to the
 * active theme. Previously it relied on a fixed border color and white
 * background — consumers upgrading past 2.0.90 will see the ring-based focus
 * style and theme-aware surface colors.
 *
 * A `type="number"` field hands `onChange` a numeric `event.target.value`, and a
 * cleared field reports `''` rather than `0`, so a caller can tell "empty" apart
 * from "the user typed zero". Previously the empty string was coerced too and a
 * cleared field was indistinguishable from a zero — consumers upgrading past
 * 2.2.39 that feed the value straight into arithmetic should handle `''`.
 */
export { Input, inputVariants } from './components/Input';
export { INPUT_BASE_CLASSES, VARIANT_COLORS } from './constants/inputClassNames';
export type { InputProps, InputVariant } from './components/Input';

/**
 * DIALOG_CARD_WITHOUT_HOVER – className string for `Card variant="dialog"` cards
 * that should render without the default hover scale/transition effect.
 */
export { DIALOG_CARD_WITHOUT_HOVER } from './constants/inputClassNames';

/**
 * InputOTP – One-time-password input components and variant styles.
 */
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './components/InputOtp';
export type { InputOTPSlotProps } from './components/InputOtp';
export { inputOTPSlotVariants, inputOTPCaretVariants } from './constants/inputOtpVariants';

/**
 * Card – A container component for grouping related content with optional variants.
 */
export { Card, cardVariants, CardContent } from './components/Card';
export type { CardProps, CardVariant } from './components/Card';

/**
 * CardList – A generic, scrollable card list with built-in search, infinite scroll, and multi-select support.
 */
export { default as CardList } from './components/CardList';
export type { CardListProps, CardListItemProps, CardListHeader } from './components/CardList';

/**
 * SelectableListRow – The shared selectable list-row shell used inside a `CardList` `renderItem`.
 *
 * Owns the full-width selection/hover background (so it spans the leading checkbox and the trailing
 * action menu, not just the content), the `leading` / content / `trailing` slot layout, an optional
 * `overlay`, and optional row-level click + keyboard activation (`onActivate` → `role="button"`,
 * Enter/Space; the handler receives the triggering mouse or keyboard event as an optional
 * argument). Two selection looks via `variant`: `surface` (neutral fill) and `accentRail`
 * (primary left rail + accent fill). Used by the mail message list and the chat conversation list.
 */
export { default as SelectableListRow } from './components/SelectableListRow';
export type {
  SelectableListRowProps,
  SelectableListRowVariant,
  SelectableListRowAlign,
} from './components/SelectableListRow';

/**
 * SectionCard – The standard liquid-glass content surface for page sections.
 *
 * Renders a `<section>` with the `liquid-glass` surface (variant `default`) or no
 * background (variant `transparent`), an optional header and a body. The header is
 * either a custom `header` node or, failing that, a `label` — a string `label`
 * renders as an `h3`, any other node renders as-is. Padding density is controlled
 * via the `padding` prop (`default`, `compact`, `none`); the body drops its top
 * padding automatically when a header is present. The body always carries
 * `text-sm`, so content that needs the default body size must set its own.
 * `className` and `bodyClassName` extend their respective class strings;
 * `headerClassName` extends the header generated from `label`, while a custom
 * `header` node is rendered as-is. Set `bordered={false}` to drop the surface
 * border and `withBackground={false}` to force a transparent, unblurred surface.
 * When `id` is set, the content is wrapped in an `AnchorSection` for anchor-based
 * navigation, while `surfaceId` sets the DOM id of the `<section>` itself.
 * Remaining props are spread onto the `<section>`.
 *
 * Passing `onClick` makes the whole card an activatable surface: it joins the tab
 * order with `tabIndex={0}`, activates on Enter and Space, and gains `cursor-pointer`
 * plus a focus-visible ring, so callers need not paint the pointer cursor themselves.
 * A key press on a control inside the card is left to that control, an explicit
 * `tabIndex` takes precedence, and a caller `onKeyDown` runs first and can suppress
 * the card's own activation by calling `preventDefault()`. No
 * `role="button"` is set — a card hosting its own buttons must not be announced as
 * a button, since a `button` role may not contain interactive descendants.
 *
 * `SECTION_CARD_STYLES` exposes the underlying class strings (surface, variant
 * backgrounds, padding densities, header and body bases) for components that
 * compose the same surface themselves, such as section accordions.
 */
export { default as SectionCard } from './components/SectionCard';
export type { SectionCardProps } from './components/SectionCard';
export { SECTION_CARD_STYLES } from './constants/sectionCardStyles';
export type { SectionCardVariant, SectionCardPadding } from './constants/sectionCardStyles';

/**
 * AddCard – A fully clickable "create new" placeholder card.
 *
 * Renders a ui-kit `Button` on the shared `liquid-glass` surface (reused from
 * `SECTION_CARD_STYLES`) with a centered icon tile, `title` and optional
 * `description`. Use it as the trailing "add new" tile in card grids (new
 * conference, new document, …). The icon is consumer-supplied, so the card
 * stays icon-library agnostic; it is keyboard accessible and honors `disabled`.
 */
export { default as AddCard } from './components/AddCard';
export type { AddCardProps } from './components/AddCard';

/**
 * StatValue – A numeric stat display with an emphasized value and an optional muted denominator.
 *
 * Renders a large, bold `value` (foreground) next to an optional muted `total`
 * (shown as `/ {total}`), an optional `unit` appended to the total (e.g. `GB`)
 * and an optional trailing `label` caption. The `size` prop (`sm`, `md`, `lg`) picks
 * the scale: `sm` for dense tiles placing several stats side by side, `md` for a
 * card-sized stat and `lg` for a hero-sized one. All content is supplied via props,
 * so the component stays i18n- and data-source-agnostic. Used by the conference
 * cards and the dashboard quota card. The matching `StatValueProps` and
 * `StatValueSize` types are exported.
 */
export { default as StatValue } from './components/StatValue';
export type { StatValueProps, StatValueSize } from './components/StatValue';

/**
 * ItemList – A compact list of named items used in confirmation and warning dialogs. Supports a
 * default vertical (`'list'`) layout that auto-collapses to a centered paragraph for a single item
 * and switches to a scroll area for many, plus an `'inline'` layout that renders the items as a
 * comma-separated wrapping paragraph.
 */
export { default as ItemList } from './components/ItemList';
export type { ItemListProps, ItemListLayout, ListItem } from './components/ItemList';

/**
 * useElementWidth – ResizeObserver-backed hook returning a DOM element's clientWidth.
 */
export { default as useElementWidth } from './hooks/useElementWidth';

/**
 * useCenterScroll – Scrolls a container so a given target pixel position is centered. Re-centers whenever the container width, target, or track width changes (e.g. on resize).
 */
export { default as useCenterScroll } from './hooks/useCenterScroll';

/**
 * cn – Utility function for merging Tailwind CSS class names (clsx + twMerge).
 */
export { default as cn } from './utils/cn';

/**
 * normalizeWheelDelta – Normalizes a wheel event's `deltaY` to pixels regardless of its `deltaMode`
 * (pixel, line or page), so consumers can apply a consistent scroll amount. Line deltas are scaled by
 * a fixed line height and page deltas by the passed `pageSize` (e.g. the viewport's client height).
 */
export { default as normalizeWheelDelta } from './utils/normalizeWheelDelta';

/**
 * formatCountBadge – Formats a numeric badge count for display, clamping values above `max` (default `99`) to a `"<max>+"` string. Use it wherever an unread/notification count is rendered so every surface clamps identically.
 */
export { default as formatCountBadge } from './utils/formatCountBadge';

/**
 * CountBadge – Compact pill showing a clamped numeric count (unread/notification counters).
 */
export { default as CountBadge } from './components/CountBadge';
export type { CountBadgeProps } from './components/CountBadge';

/**
 * MenuBar – A responsive navigation bar with recursively nested sub-items and mobile support.
 *
 * Supports arbitrarily deep submenus: nodes up to `maxDepth` render inline as expandable
 * accordions; deeper nodes switch to a drill-down view with a back button (`backLabel`).
 * Use `onChildClick` to observe child selections at the parent level (e.g. for route
 * highlighting that cannot be derived from the tree alone).
 *
 * Composable parts:
 * - `MenuBar` – High-level component that accepts a config object to render the full menu bar.
 * - `MenuBarLayout` – The outer layout shell (desktop sidebar / mobile bottom bar).
 * - `MenuBarHeader` – The header area with the menu bar title. The `icon` prop is accepted for API compatibility but no longer rendered.
 * - `MenuBarItem` – A single top-level navigation item with a recursive child tree.
 * - `MenuBarItemList` – A scrollable list of `MenuBarItem` entries.
 */
export { default as MenuBarLayout } from './components/MenuBarLayout';
export type { MenuBarLayoutProps } from './components/MenuBarLayout';

export { default as MenuBarHeader } from './components/MenuBarHeader';
export type { MenuBarHeaderProps } from './components/MenuBarHeader';

export { default as MenuBarItem } from './components/MenuBarItem';
export type { MenuBarItemProps } from './components/MenuBarItem';

export { default as MenuBarItemList } from './components/MenuBarItemList';
export type { MenuBarItemListProps } from './components/MenuBarItemList';

export { default as MenuBar } from './components/MenuBar';
export type { MenuBarProps, MenuBarConfig } from './components/MenuBar';
export type { default as MenuBarConfigItem } from './components/MenuBarConfigItem';

/**
 * MenuBarItemActions – The per-item context-action (three-dot) menu rendered inside a `MenuBar`
 * row when a `MenuBarConfigItem` provides `contextActions`. Shows a kebab trigger (revealed on
 * hover/focus, always visible on touch) that opens a `DropdownMenu` of the item's actions.
 */
export { default as MenuBarItemActions } from './components/MenuBarItemActions';
export type { default as MenuBarItemAction } from './components/MenuBarItemAction';

/**
 * MenuBarDropData – Optional drag-and-drop target descriptor for a `MenuBarConfigItem`. When set,
 * the item's row registers as a `@dnd-kit` droppable (highlighted while hovered by a matching drag).
 * `accepts` is matched against the active draggable's `data.type`; non-matching drags are ignored.
 * `onDrop` receives the active draggable's `data` payload. Requires the `MenuBar` to be rendered
 * inside a `DndContext`; items without `dropData` stay inert, so existing menus are unaffected.
 */
export type { default as MenuBarDropData } from './components/MenuBarDropData';

/**
 * MenuBarSearchInput – Opt-in search input rendered inside `MenuBar` when `MenuBarConfig.search`
 * is provided. Controlled input with a magnifier icon, clear-X button, Enter-to-submit (forwards
 * the trimmed query), and Escape-to-clear. While the field is focused and holds a query, `Escape` clears it and stops
 * propagating, so a surrounding dialog stays open with the input entered in it. A second `Escape` — or a first one on
 * an empty field — reaches the dialog and closes it.
 */
export { default as MenuBarSearchInput } from './components/MenuBarSearchInput';
export type { MenuBarSearchInputProps } from './components/MenuBarSearchInput';

/**
 * filterMenuTreeByQuery – Recursive, case-insensitive substring filter over a `MenuBarConfigItem`
 * tree. Returns the visible subtree plus the set of ancestor ids that must be auto-expanded so a
 * matching descendant is reachable. Siblings of unmatched nodes are dropped; a self-match keeps
 * all children intact so the user can still drill into the node.
 */
export { default as filterMenuTreeByQuery } from './utils/filterMenuTreeByQuery';
export type { FilterMenuTreeResult } from './utils/filterMenuTreeByQuery';

/**
 * ResizablePanelGroup / ResizablePanel / ResizableHandle – Two-pane resizable layout primitives
 * built on `react-resizable-panels`. Provides keyboard navigation (Arrow / Home / End),
 * WAI-ARIA `role="separator"`, touch-friendly hit targets, and optional `localStorage`
 * persistence via `autoSaveId`. Use `withHandle` on `ResizableHandle` to render a visible
 * grip indicator. Pass a stable `id` to each `ResizablePanel` when panels are
 * conditionally rendered so persisted layouts survive panel-set changes.
 * `useResizablePanelLayout(id, panelIds, { onlySaveAfterUserInteractions })` restores and
 * stores a group's layout under `id`; with `onlySaveAfterUserInteractions` it stores only
 * layouts the user resized.
 */
export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  useResizablePanelLayout,
} from './components/ResizablePanelGroup';

/**
 * SplitPane – Two-pane resizable layout primitive composed on top of `ResizablePanelGroup`. Handles
 * mobile single-pane fallback (configurable via `mobileBreakpointQuery` and `mobilePane`), optional
 * `localStorage` persistence (`autoSaveId`), and percentage sizing including preset shorthands
 * (`'1/4'`, `'1/3'`, `'1/2'`, `'2/3'`, `'3/4'`). Use `orientation="vertical"` for top/bottom splits.
 * Min/max/default sizes are interpreted as percentages of the parent group.
 *
 * `fitLeftSize` sizes the left pane to a CSS width (e.g. `'296px'`) and follows it until the user drags
 * the handle; pass `null` while the width is still being measured. With it, `autoSaveId` stores only
 * dragged widths, a dragged or stored width wins over the fitted one, and the left pane keeps its pixel
 * width when the window changes width.
 *
 * `autoSaveId` must be unique per SplitPane instance — two SplitPanes sharing the same value
 * will alias each other's persisted layouts in `localStorage`.
 */
export { default as SplitPane } from './components/SplitPane/SplitPane';
export type {
  SplitPaneProps,
  SplitPaneOrientation,
  SplitPanePreset,
  SplitPaneSide,
} from './components/SplitPane/splitPaneInternals';

/**
 * SelectionWizard – A step-driven selection surface for pick-then-pick flows with any number of steps. With
 * `layout="columns"` the steps render side by side as resizable columns on wide screens, in a window of up to
 * `maxColumns` (default 3) that slides along with the active step; on narrow screens or with `layout="steps"`
 * one step renders at a time. The step rail in the header
 * shows progress, each step's `pickLabel` and, on a finished step, its `pickIcon` instead of a check mark; the footer carries back/next, an optional submit and the
 * active step's `secondaryAction`. State stays with the caller: pass `steps` with `isComplete` and `render`,
 * plus `activeStepId`/`onActiveStepChange`. Render it inline, as a dialog via `as="dialog"`, or via `as="adaptive"`
 * as that dialog on wide screens and as a bottom sheet on narrow ones, both with `isOpen`/`onClose` and a required
 * `title`, which names the dialog for a screen reader. Labels are pre-translated strings.
 */
export { default as SelectionWizard } from './components/SelectionWizard/SelectionWizard';
export type {
  SelectionWizardProps,
  SelectionWizardStep,
  SelectionWizardLabels,
  SelectionWizardLayout,
  SelectionWizardShell,
  SelectionWizardSecondaryAction,
} from './components/SelectionWizard/selectionWizardInternals';

/**
 * useMediaQuery – Hook that tracks whether a CSS media query matches (e.g. responsive breakpoints).
 */
export { default as useMediaQuery } from './hooks/useMediaQuery';

/**
 * useKeyboardInset – Hook that returns how many pixels the on-screen keyboard covers at the bottom of the viewport,
 * so a bottom sheet can move above it. Returns 0 where the browser has no visualViewport.
 */
export { default as useKeyboardInset } from './hooks/useKeyboardInset';

/**
 * keyboardInsetStyle – Turns the inset from `useKeyboardInset` into the `bottom` and `maxHeight` that lift a bottom
 * sheet above the on-screen keyboard. Returns undefined while no keyboard covers the viewport.
 */
export { default as keyboardInsetStyle } from './utils/keyboardInsetStyle';

/**
 * useEscapeCapture – Hook that swallows `Escape` while a floating panel is open, so only that panel closes.
 *
 * Radix's `DismissableLayer` listens for `Escape` on the document in the capture phase, so a panel that is not
 * itself a Radix layer (a portaled option list, a command panel) lets the keypress through and the surrounding
 * dialog closes with it, losing whatever was entered. This listens one step higher — on the window, same phase —
 * and calls `stopImmediatePropagation`, so the dialog never sees the keypress. The listener exists only while
 * `isActive`, so the next `Escape` closes the dialog as usual.
 *
 * `onEscape` is read through a ref, so passing a fresh closure on every render does not re-register the listener.
 *
 * @param isActive Whether the panel is open; the listener is registered only while this is true.
 * @param onEscape Called instead of the dialog's own dismissal when `Escape` is pressed.
 */
export { default as useEscapeCapture } from './hooks/useEscapeCapture';

/**
 * useOnClickOutside – Hook that fires a callback when a click occurs outside the referenced element.
 */
export { default as useOnClickOutside } from './hooks/useOnClickOutside';

/**
 * usePopoverOutsideDismiss – Hook that closes a controlled radix Popover on a pointer down outside its anchor.
 *
 * Radix defers its own outside dismiss to the click event and skips it when that click opens another modal
 * layer, which leaves the popover open on top of the new layer. This dismisses on pointer down instead.
 * Pointer downs inside any popper content are ignored, so nested poppers (dropdowns, selects) keep working.
 *
 * @param anchorRef Ref to the popover's anchor/trigger element; pointer downs inside it are left to the trigger.
 * @param onDismiss Called when a pointer goes down outside the anchor and outside every popper.
 */
export { default as usePopoverOutsideDismiss } from './hooks/usePopoverOutsideDismiss';

/**
 * synthesizePenClick – PointerDown handler that synthesizes a click for Apple Pencil (`pointerType === 'pen'`) input,
 * working around Safari/WebView dropping pen taps on non-`button` interactive elements (links, `role="button"` divs).
 * No-op for mouse and touch, which keep their native click behaviour.
 */
export { default as synthesizePenClick } from './utils/synthesizePenClick';

/**
 * Label – A styled label component built on Radix UI Label primitive.
 */
export { Label, labelVariants } from './components/Label';

/**
 * Switch – A toggle switch component built on Radix UI Switch primitive.
 */
export { default as Switch } from './components/Switch';

/**
 * Separator – A visual divider built on Radix UI Separator primitive.
 */
export { default as Separator } from './components/Separator';

/**
 * Tabs – A tabbed interface built on Radix UI Tabs primitive.
 */
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';

/**
 * Textarea – A styled multi-line text input.
 */
export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

/**
 * Tooltip – A tooltip component built on Radix UI Tooltip primitive.
 */
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/Tooltip';

/**
 * RadioGroup – A set of radio buttons built on Radix UI RadioGroup primitive.
 */
export { RadioGroup, RadioGroupItem } from './components/RadioGroup';
export type { RadioGroupProps, RadioGroupItemProps } from './components/RadioGroup';

/**
 * Popover – A floating panel built on Radix UI Popover primitive.
 */
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './components/Popover';

/**
 * ScrollArea – A custom scrollable area built on Radix UI ScrollArea primitive.
 */
export { ScrollArea, ScrollBar } from './components/ScrollArea';

/**
 * Progress – A progress bar built on Radix UI Progress primitive.
 */
export { default as Progress } from './components/Progress';

/**
 * Table – Styled HTML table primitives for building data tables.
 */
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/Table';
export type { TableRowVariant, TableRowProps } from './components/Table';

/**
 * ActionTooltip – A tooltip wrapper that also acts as a clickable button with keyboard support.
 */
export { default as ActionTooltip } from './components/ActionTooltip';

/**
 * AnchorSection – A section element with scroll-margin for anchor-based navigation.
 */
export { default as AnchorSection } from './components/AnchorSection';

/**
 * IconWithCount – An icon with an optional count badge overlay.
 */
export { default as IconWithCount } from './components/IconWithCount';

/**
 * InputWithActionIcons – A text input with action icon buttons positioned on the right side.
 * Each action icon accepts an optional `label`, rendered as the icon button's `aria-label`.
 */
export { default as InputWithActionIcons } from './components/InputWithActionIcons';
export type { InputWithActionIconsProps, ActionIcon } from './components/InputWithActionIcons';

/**
 * WarningBox – A color-customizable warning box displaying an optional title, a description, and an optional
 * comma-separated inline file list that wraps within the box. `layout="inline"` lays it out as a single row for
 * toolbars and headers.
 */
export { default as WarningBox } from './components/WarningBox';
export type { WarningBoxLayout, WarningBoxProps, WarningBoxVariant } from './components/WarningBox';

/**
 * CircleLoader – A spinning circle loading indicator with configurable size and speed.
 */
export { default as CircleLoader } from './components/CircleLoader';
export type { CircleLoaderProps } from './components/CircleLoader';

/**
 * CircularProgress – A determinate circular progress ring; pass `value` (0..1) to fill the arc (e.g. context-window usage gauges).
 */
export { default as CircularProgress } from './components/CircularProgress';
export type { CircularProgressProps } from './components/CircularProgress';

/**
 * HorizontalLoader – An animated horizontal progress bar for loading states.
 */
export { default as HorizontalLoader } from './components/HorizontalLoader';
export type { HorizontalLoaderProps } from './components/HorizontalLoader';

/**
 * NumberPad – A numeric keypad component with digits 0–9 and a backspace button.
 */
export { default as NumberPad } from './components/NumberPad';
export type { NumberPadProps } from './components/NumberPad';

/**
 * MediaComponent – A video/audio player component with playback controls.
 */
export { default as MediaComponent } from './components/MediaComponent';
export type { MediaComponentProps } from './components/MediaComponent';

/**
 * FileSelectButton – A styled file input button with customizable labels.
 */
export { default as FileSelectButton } from './components/FileSelectButton';
export type { FileSelectButtonProps } from './components/FileSelectButton';

/**
 * TextPreview – A preformatted text display with word wrapping.
 */
export { default as TextPreview } from './components/TextPreview';
export type { TextPreviewProps } from './components/TextPreview';

/**
 * DynamicEllipsis – A text component that truncates with an ellipsis in the middle when overflowing.
 */
export { default as DynamicEllipsis } from './components/DynamicEllipsis';
export type { DynamicEllipsisProps } from './components/DynamicEllipsis';

/**
 * QRCodeDisplay – A QR code renderer with configurable size and loading state.
 */
export { default as QRCodeDisplay } from './components/QRCodeDisplay';
export type { QRCodeDisplayProps, QRCodeSize } from './components/QRCodeDisplay';

/**
 * Breadcrumb – A navigation breadcrumb built on Radix UI Slot with separator and ellipsis support.
 */
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './components/Breadcrumb';
export type { BreadcrumbLinkProps } from './components/Breadcrumb';

/**
 * Calendar – A date picker calendar built on react-day-picker with styled day cells.
 */
export { Calendar } from './components/Calendar';
export type { CalendarProps } from './components/Calendar';

/**
 * CalendarDropdownCaption – A drop-in `MonthCaption` component for {@link Calendar}. Pass it via
 * `components={{ MonthCaption: CalendarDropdownCaption }}` with `hideNavigation` (it renders its own previous/next
 * buttons) and `startMonth`/`endMonth`, to replace the plain month/year label with month and year dropdowns. Reads its accessible
 * names from the DayPicker `labels` (`labelMonthDropdown`, `labelYearDropdown`, `labelPrevious`, `labelNext`).
 */
export { default as CalendarDropdownCaption } from './components/CalendarDropdownCaption';

/**
 * DateTimePicker – A controlled date/time/datetime picker with month/year dropdowns, previous/next month
 * navigation, wheel-scrollable time selection, double-click time editing inside the popover and double-click
 * direct text entry on the field itself (single click opens the calendar, double click edits the date and
 * time as text). Pass `mode` to switch between date, time and datetime. Provide `previousMonthLabel` and
 * `nextMonthLabel` to give the icon-only month-navigation buttons accessible names.
 *
 * While the field is in text-entry mode, `Escape` cancels the edit and stops propagating, so a surrounding dialog
 * stays open and keeps the input entered in it. A second `Escape` then reaches the dialog and closes it.
 */
export { default as DateTimePicker } from './components/DateTimePicker';
export type { DateTimePickerProps } from './components/DateTimePicker';
export { default as DATETIME_PICKER_MODES } from './constants/dateTimePickerModes';
export type { TDateTimePickerMode } from './constants/dateTimePickerModes';

/**
 * Checkbox – A styled checkbox built on Radix UI Checkbox primitive with label support.
 */
export { default as Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

/**
 * Form – Form primitives built on react-hook-form with Radix UI Label and Slot integration.
 */
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormFieldSH,
} from './components/Form';

/**
 * DraggableTableRow – A table row with drag-and-drop support built on dnd-kit.
 *
 * The row takes only dnd-kit's activation listeners, never its attribute bag, so it keeps its native
 * `row` semantics and never becomes a button or a tab stop.
 *
 * `isRowDisabled` suppresses dragging and sets `data-disabled`. `aria-disabled` follows only on a row
 * that carries no `onRowClick`, because that state applies to the row's focusable descendants as well
 * and would announce a still-operable row's controls as disabled. A disabled row that stays clickable
 * therefore has no accessible disabled state of its own: the caller must render the row's own
 * interactive controls -- its selection checkbox, its action buttons -- in a disabled state.
 */
export { default as DraggableTableRow } from './components/DraggableTableRow';
export type { DraggableTableRowProps } from './components/DraggableTableRow';

/**
 * DropZone – A file drop zone built on react-dropzone with drag-active styling.
 */
export { default as DropZone } from './components/DropZone';
export type { DropZoneProps } from './components/DropZone';

/**
 * ProgressBox – A progress indicator with title, description, and percentage display.
 */
export { default as ProgressBox } from './components/ProgressBox';
export type { ProgressBoxProps, ProgressBoxData } from './components/ProgressBox';

/**
 * FullScreenImage – A centered full-screen image display.
 */
export { default as FullScreenImage } from './components/FullScreenImage';
export type { FullScreenImageProps } from './components/FullScreenImage';

/**
 * ImageComponent – An image component with error fallback and placeholder support.
 */
export { default as ImageComponent } from './components/ImageComponent';
export type { ImageComponentProps } from './components/ImageComponent';

/**
 * TimeUnitButton – Generic button for selecting a numeric time unit (hour or minute) in a time picker.
 * Supports an optional `format` function to control the displayed label.
 */
export { default as TimeUnitButton } from './components/TimeUnitButton';
export type { TimeUnitButtonProps } from './components/TimeUnitButton';

/**
 * HourButton – A button for selecting an hour value in a time picker.
 */
export { default as HourButton } from './components/HourButton';
export type { HourButtonProps } from './components/HourButton';

/**
 * MinuteButton – A button for selecting a minute value in a time picker.
 */
export { default as MinuteButton } from './components/MinuteButton';
export type { MinuteButtonProps } from './components/MinuteButton';

/**
 * DropdownSelect – A dropdown select with optional search filter and a portal- or absolute-positioned option panel.
 *
 * Defaults match the previous behavior: the search input appears when more than three options are passed, and the
 * panel is rendered into `document.body` via `createPortal`. Both behaviors can be disabled per call site:
 * - `enableSearch={false}` keeps the trigger as a read-only field even with many options.
 * - `searchFromOptionCount` moves the threshold, e.g. `1` to offer the field for a short list of long labels.
 * - `enablePortalUsage={false}` renders the panel inline next to the trigger using CSS absolute positioning, for
 *   embeddings in third-party-managed DOM trees (e.g. SurveyJS) where a portal target outside the host tree is
 *   unreachable.
 *
 * Two hooks shape how an option reads. `renderLabel` maps an option's name to the text used in the trigger, the
 * search filter and the option row. `renderOption` replaces the body of a single option row with arbitrary content
 * — an icon beside the name, a colour swatch, an avatar — while `renderLabel` keeps governing the trigger and the
 * search, so an option stays findable by typing its name. It also governs the option's accessible name, so a row
 * that draws only part of the label is still announced in full.
 *
 * `groupOf` names the group an option belongs to and turns the flat list into a grouped one: the panel writes the
 * name as a heading above the first option of each group and wraps that group's options in a `role="group"` the
 * heading labels. The headings follow the filtered list, so they stay correct while the user searches. An option
 * the function names no group for keeps its place without a heading.
 *
 * While the option list is open, `Escape` closes only the list and stops propagating, so a surrounding dialog stays
 * open and keeps the input entered in it. A second `Escape` then reaches the dialog and closes it. Closing the list
 * without picking an option — by `Escape` or by a click outside — discards any text typed into the search filter, so
 * the trigger shows the current selection again rather than the abandoned query. With the focus in the field or in
 * the list, that `Escape` also hands the focus back to the field.
 */
export { default as DropdownSelect } from './components/DropdownSelect';
export type { DropdownSelectProps, DropdownOptions, DropdownVariant } from './components/DropdownSelect';

/**
 * Sheet – A slide-in side panel built on Radix UI Dialog primitive with variant support and close button.
 */
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  sheetVariants,
} from './components/Sheet';
export type {
  SheetContentProps,
  SheetHeaderProps,
  SheetOverlayProps,
  SheetTitleProps,
  SheetDescriptionProps,
  SheetFooterProps,
} from './components/Sheet';

/**
 * GradientText – Inline text with the app gradient treatment for prominent dashboard and hero copy.
 */
export { default as GradientText } from './components/GradientText';

/**
 * Dialog – A modal dialog built on Radix UI Dialog primitive with variant support and close button.
 */
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/Dialog';
export type {
  DialogContentProps,
  DialogOverlayProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from './components/Dialog';
