/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
