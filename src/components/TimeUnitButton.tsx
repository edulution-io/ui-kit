/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
