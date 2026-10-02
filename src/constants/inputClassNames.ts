/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

export const INPUT_BASE_CLASSES =
  'h-10 w-full rounded-lg px-3 text-p transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

export const DIALOG_CARD_WITHOUT_HOVER =
  'box-border w-full min-w-0 max-w-full overflow-hidden border-border shadow-none transition-none hover:scale-100';

export const VARIANT_COLORS = {
  default: 'liquid-glass-soft text-foreground',
  dialog: 'liquid-glass-soft text-foreground',
  login:
    'border-0 bg-background text-foreground shadow-sm ring-1 ring-inset ring-muted focus:bg-background focus:text-foreground focus:ring-2 focus:ring-primary',
  lightGrayDisabled: 'bg-darkGreyDisabled text-secondary',
} as const;
