/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

export type SectionCardVariant = 'default' | 'transparent';
export type SectionCardPadding = 'default' | 'compact' | 'none';

export const SECTION_CARD_STYLES = {
  surfaceBase: 'flex flex-col text-card-foreground transition-all duration-300',
  variantBackground: {
    default: 'liquid-glass',
    transparent: '',
  } as Record<SectionCardVariant, string>,
  padding: {
    default: {
      header: 'px-6 py-4',
      body: 'px-6 pb-6',
      bodyWithoutHeader: 'pt-6',
    },
    compact: {
      header: 'px-4 py-3',
      body: 'px-4 pb-4',
      bodyWithoutHeader: 'pt-4',
    },
    none: {
      header: 'p-0',
      body: 'p-0',
      bodyWithoutHeader: '',
    },
  } as Record<SectionCardPadding, { header: string; body: string; bodyWithoutHeader: string }>,
  headerBase: 'flex flex-1 items-center text-base font-semibold leading-none tracking-tight',
  bodyBase: 'text-sm',
} as const;
