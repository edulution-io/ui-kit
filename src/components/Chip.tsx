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
