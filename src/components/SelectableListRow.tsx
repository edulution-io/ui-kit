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
  /** When set, the whole row becomes the click target (`role="button"`, keyboard Enter/Space). */
  onActivate?: () => void;
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
  /** The row's main content. */
  children: React.ReactNode;
}

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
            onActivate?.();
          }
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
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
