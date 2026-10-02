/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from '../utils/cn';

const badgeVariants = cva(
  'cursor-default inline-flex max-w-full items-center rounded-lg border px-2.5 py-0.5 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-accent hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const isText = (child: React.ReactNode): child is string | number =>
  typeof child === 'string' || typeof child === 'number';

const joinAdjacentText = (children: React.ReactNode): React.ReactNode[] =>
  React.Children.toArray(children).reduce<React.ReactNode[]>((joined, child) => {
    const previous = joined[joined.length - 1];
    if (isText(child) && isText(previous)) return [...joined.slice(0, -1), `${previous}${child}`];
    return [...joined, child];
  }, []);

const Badge = ({ className, variant, children, ...props }: BadgeProps) => (
  <div
    className={cn(badgeVariants({ variant }), className, 'h-[36px]')}
    {...props}
  >
    {React.Children.map(joinAdjacentText(children), (child) =>
      isText(child) ? (
        <span
          className="min-w-0 truncate"
          title={String(child)}
        >
          {child}
        </span>
      ) : (
        child
      ),
    )}
  </div>
);

export { Badge, badgeVariants };
