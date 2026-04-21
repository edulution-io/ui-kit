/*
 * Copyright (C) [2025] [Netzint GmbH]
 * All rights reserved.
 *
 * This software is dual-licensed under the terms of:
 *
 * 1. The GNU Affero General Public License (AGPL-3.0-or-later), as published by the Free Software Foundation.
 *    You may use, modify and distribute this software under the terms of the AGPL, provided that you comply with its conditions.
 *
 *    A copy of the license can be found at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * OR
 *
 * 2. A commercial license agreement with Netzint GmbH. Licensees holding a valid commercial license from Netzint GmbH
 *    may use this software in accordance with the terms contained in such written agreement, without the obligations imposed by the AGPL.
 *
 * If you are uncertain which license applies to your use case, please contact us at info@netzint.de for clarification.
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
 * Badge – A styled label component with variant support for status indicators and tags.
 */
export { Badge, badgeVariants } from './components/Badge';
export type { BadgeProps, BadgeVariant } from './components/Badge';

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
 */
export { Input, inputVariants } from './components/Input';
export { INPUT_BASE_CLASSES, VARIANT_COLORS } from './constants/inputClassNames';
export type { InputProps, InputVariant } from './components/Input';

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
 * cn – Utility function for merging Tailwind CSS class names (clsx + twMerge).
 */
export { default as cn } from './utils/cn';

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
 * - `MenuBarHeader` – The header area with logo and collapse toggle.
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
 * useMediaQuery – Hook that tracks whether a CSS media query matches (e.g. responsive breakpoints).
 */
export { default as useMediaQuery } from './hooks/useMediaQuery';

/**
 * useOnClickOutside – Hook that fires a callback when a click occurs outside the referenced element.
 */
export { default as useOnClickOutside } from './hooks/useOnClickOutside';

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
 */
export { default as InputWithActionIcons } from './components/InputWithActionIcons';
export type { InputWithActionIconsProps, ActionIcon } from './components/InputWithActionIcons';

/**
 * WarningBox – A color-customizable warning box displaying a title, description, and file list.
 */
export { default as WarningBox } from './components/WarningBox';
export type { WarningBoxProps } from './components/WarningBox';

/**
 * CircleLoader – A spinning circle loading indicator with configurable size and speed.
 */
export { default as CircleLoader } from './components/CircleLoader';
export type { CircleLoaderProps } from './components/CircleLoader';

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
 * DropdownSelect – A searchable dropdown select component with portal-based menu.
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
