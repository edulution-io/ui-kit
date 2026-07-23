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

import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
import { Button } from './Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './DropdownMenu';

export interface MonthYearOption {
  value: number;
  label: string;
}

export interface MonthYearSelectProps {
  label: string;
  ariaLabel?: string;
  options: MonthYearOption[];
  selected: number;
  onSelect: (value: number) => void;
}

const MonthYearSelect: React.FC<MonthYearSelectProps> = ({ label, ariaLabel, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const frame = requestAnimationFrame(() => selectedItemRef.current?.scrollIntoView?.({ block: 'center' }));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="btn-outline"
          aria-label={ariaLabel}
          className="h-8 min-w-0 flex-1 justify-between gap-1 rounded-lg px-2 py-0 text-sm font-medium"
        >
          <span className="truncate">{label}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="h-3 w-3 shrink-0 opacity-60"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-60 overflow-y-auto">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            ref={option.value === selected ? selectedItemRef : undefined}
            onClick={() => onSelect(option.value)}
            className={cn(option.value === selected && 'bg-accent text-accent-foreground')}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MonthYearSelect;
