/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import cn from '../utils/cn';

/** Selection appearance of a {@link SelectableListRow}. */
export type SelectableListRowVariant = 'surface' | 'accentRail';

/** Cross-axis alignment of the row's leading/content/trailing slots. */
export type SelectableListRowAlign = 'start' | 'center';

export interface SelectableListRowProps {
  /** Whether the row is the currently selected/open item; paints the active background. */
  isActive?: boolean;
  /** Dims the row and blocks pointer events (e.g. while a background operation runs). */
  isDisabled?: boolean;
  /** Forwarded to `aria-busy`; set while the row is performing a background operation. */
  ariaBusy?: boolean;
  /** Cross-axis alignment of the slots. Defaults to `center`. */
  align?: SelectableListRowAlign;
  /** Selection style: `surface` (neutral fill) or `accentRail` (primary left rail + accent fill). Defaults to `surface`. */
  variant?: SelectableListRowVariant;
  /** When set, the whole row becomes the click target (`role="button"`, keyboard Enter/Space). Receives the triggering mouse or keyboard event; the argument is optional. */
  onActivate?: (event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
  /** Context-menu (right-click) handler; only meaningful for interactive rows. */
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Leading slot rendered before the content (e.g. a selection checkbox). */
  leading?: React.ReactNode;
  /** Trailing slot rendered after the content (e.g. a context-action menu). */
  trailing?: React.ReactNode;
  /** Absolutely-positioned overlay rendered above the row (e.g. a busy spinner). */
  overlay?: React.ReactNode;
  /** Extra classes for spacing/gap; merged onto the row container. */
  className?: string;
  /** Test id rendered on the row container. */
  'data-testid'?: string;
  /** The row's main content. */
  children: React.ReactNode;
  /** Any further `data-*` attribute; forwarded verbatim onto the row container. */
  [dataAttribute: `data-${string}`]: unknown;
}

const dataAttributesOf = (props: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(props).filter(([key]) => key.startsWith('data-')));

const ACTIVE_CLASSES: Record<SelectableListRowVariant, string> = {
  surface: 'bg-muted-light dark:bg-muted-background',
  accentRail: 'border-l-2 border-l-primary bg-accent',
};

const INACTIVE_CLASSES: Record<SelectableListRowVariant, string> = {
  surface: 'hover:bg-muted-light dark:hover:bg-muted-background',
  accentRail: 'border-l-2 border-l-transparent hover:bg-muted-light dark:hover:bg-muted-background',
};

/**
 * A selectable list-row shell owning the full-width selection/hover background, the
 * leading/content/trailing slot layout, and optional row-level click + keyboard activation.
 * Used by the mail message list and the chat conversation list so the selected background
 * consistently spans the checkbox and trailing-menu columns.
 */
const SelectableListRow: React.FC<SelectableListRowProps> = ({
  isActive = false,
  isDisabled = false,
  ariaBusy,
  align = 'center',
  variant = 'surface',
  onActivate,
  onContextMenu,
  leading,
  trailing,
  overlay,
  className,
  children,
  'data-testid': dataTestId,
  ...rest
}) => {
  const isInteractive = typeof onActivate === 'function';

  const interactiveProps: React.HTMLAttributes<HTMLDivElement> = isInteractive
    ? {
        role: 'button',
        tabIndex: 0,
        onClick: onActivate,
        onContextMenu,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onActivate?.(event);
          }
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
      {...dataAttributesOf(rest)}
      data-testid={dataTestId}
      aria-busy={ariaBusy}
      className={cn(
        'group relative flex w-full text-left transition-colors',
        align === 'start' ? 'items-start' : 'items-center',
        isInteractive &&
          'cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring',
        isActive ? ACTIVE_CLASSES[variant] : INACTIVE_CLASSES[variant],
        isDisabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {overlay}
      {leading}
      {children}
      {trailing}
    </div>
  );
};

export default SelectableListRow;
