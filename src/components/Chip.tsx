/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from '../utils/cn';

const chipVariants = cva(
  'inline-flex items-center rounded-lg px-1.5 py-0.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-foreground',
        interactive: 'cursor-pointer bg-accent text-foreground hover:bg-primary hover:text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type ChipVariant = NonNullable<VariantProps<typeof chipVariants>['variant']>;

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof chipVariants>;

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(({ className, variant, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(chipVariants({ variant }), className)}
    {...props}
  />
));

Chip.displayName = 'Chip';

export { Chip, chipVariants };
