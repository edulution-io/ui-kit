/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from '../utils/cn';

const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow-lg', {
  variants: {
    variant: {
      organisation: 'border-primary border-4',
      security: 'gradient-box',
      modal:
        'border-4 border-white fixed left-[50%] top-[40%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-[25px] text-background',
      text: 'border-accent border-3 bg-glass backdrop-blur-lg bg-opacity-20 inset-2 overflow-auto scrollbar-none hover:scrollbar-thin',
      dialog: 'bg-glass border-white dark:border-black transition-transform duration-300 hover:scale-105',
      grid: 'border border-accent hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-[border-color,background-color,box-shadow,transform] duration-200 hover:scale-[103%]',
      gridSelected:
        'border-primary bg-primary/5 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-[border-color,background-color,box-shadow,transform] duration-200 hover:scale-[103%]',
      tile: 'rounded m-1 flex h-32 w-32 flex-col items-center overflow-hidden bg-glass border-white dark:border-black transition-transform duration-300 hover:scale-105 md:w-48',
      tileSelected:
        'rounded m-1 flex h-32 w-32 flex-col items-center overflow-hidden border-0 shadow-none bg-ciGreenToBlue text-primary-foreground transition-transform duration-300 hover:scale-105 md:w-48',
    },
  },
  defaultVariants: {
    variant: 'organisation',
  },
});

export type CardVariant = NonNullable<VariantProps<typeof cardVariants>['variant']>;

export type CardProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant }), 'border-solid', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-[20px]', className)}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

export { Card, cardVariants, CardContent };
