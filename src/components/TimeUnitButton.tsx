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

import React, { useCallback } from 'react';
import cn from '../utils/cn';
import { Button } from './Button';
import { DropdownVariant } from './DropdownSelect';

export interface TimeUnitButtonProps {
  value: number;
  currentValue: number;
  onChange: (value: number) => void;
  variant: DropdownVariant;
  format?: (value: number) => string;
}

const TimeUnitButton: React.FC<TimeUnitButtonProps> = ({ value, currentValue, onChange, variant, format }) => {
  const handleClick = useCallback(() => onChange(value), [value, onChange]);
  const isSelected = currentValue === value;
  const label = format ? format(value) : String(value);

  return (
    <Button
      variant={isSelected ? 'btn-outline' : 'btn-small'}
      className={cn('aspect-square max-h-[25px] max-w-[64px] shrink-0 sm:w-full', {
        'bg-foreground text-background': variant === 'default',
        'bg-primary text-primary-foreground shadow-none hover:bg-primary hover:text-primary-foreground':
          variant === 'dialog' && isSelected,
        'border border-background/35 bg-background/10 text-foreground shadow-none backdrop-blur-sm hover:bg-background/35 dark:border-foreground/15 dark:hover:bg-foreground/15':
          variant === 'dialog' && !isSelected,
      })}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default TimeUnitButton;
