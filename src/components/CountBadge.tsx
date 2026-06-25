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
