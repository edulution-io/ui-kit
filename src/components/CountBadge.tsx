/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import cn from '../utils/cn';
import formatCountBadge from '../utils/formatCountBadge';

export interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number;
  max?: number;
}

const COUNT_BADGE_CLASSES =
  'inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium tabular-nums leading-none text-foreground dark:text-primary-foreground';

const CountBadge: React.FC<CountBadgeProps> = ({ count, max, className, ...props }) => (
  <span
    className={cn(COUNT_BADGE_CLASSES, className)}
    {...props}
  >
    {formatCountBadge(count, max)}
  </span>
);

export default CountBadge;
