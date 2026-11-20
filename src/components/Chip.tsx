/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
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

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof chipVariants> & {
    selected?: boolean;
    asChild?: boolean;
  };

const SELECTED_CLASSES = 'bg-primary text-primary-foreground';

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, selected = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        className={cn(chipVariants({ variant }), selected && SELECTED_CLASSES, className)}
        {...props}
      />
    );
  },
);

Chip.displayName = 'Chip';

export { Chip, chipVariants };
