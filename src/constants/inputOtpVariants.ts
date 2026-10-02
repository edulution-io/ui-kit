/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { cva } from 'class-variance-authority';
import { VARIANT_COLORS } from './inputClassNames';

const VARIANT_CARET = {
  default: 'bg-secondary',
  dialog: 'bg-foreground',
  login: 'bg-black',
} as const;

export const inputOTPSlotVariants = cva(
  'relative mx-1 flex h-11 w-11 items-center justify-center rounded-lg shadow-sm transition-all first:ml-0',
  {
    variants: {
      variant: {
        default: VARIANT_COLORS.default,
        dialog: VARIANT_COLORS.dialog,
        login: VARIANT_COLORS.login,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const inputOTPCaretVariants = cva('h-4 w-px animate-caret-blink duration-1000', {
  variants: {
    variant: {
      default: VARIANT_CARET.default,
      dialog: VARIANT_CARET.dialog,
      login: VARIANT_CARET.login,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
