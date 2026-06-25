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

import React from 'react';
import cn from '../utils/cn';

const STAT_VALUE_SIZE = {
  md: { value: 'text-2xl', secondary: 'text-base' },
  lg: { value: 'text-4xl', secondary: 'text-xl' },
} as const;

type StatValueSize = keyof typeof STAT_VALUE_SIZE;

interface StatValueProps {
  value: React.ReactNode;
  total?: React.ReactNode;
  unit?: string;
  label?: React.ReactNode;
  size?: StatValueSize;
  className?: string;
}

const StatValue: React.FC<StatValueProps> = ({ value, total, unit, label, size = 'md', className }) => {
  const sizeStyles = STAT_VALUE_SIZE[size];

  return (
    <div className={cn('flex items-baseline gap-1.5', className)}>
      <span className={cn('font-bold tabular-nums leading-none text-foreground', sizeStyles.value)}>{value}</span>
      {total !== undefined && total !== null && (
        <span className={cn('font-bold tabular-nums text-muted-foreground', sizeStyles.secondary)}>
          {'/ '}
          {total}
          {unit ? ` ${unit}` : ''}
        </span>
      )}
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
};

export default StatValue;
export type { StatValueProps, StatValueSize };
