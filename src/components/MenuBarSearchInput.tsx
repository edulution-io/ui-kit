/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
import useEscapeCapture from '../hooks/useEscapeCapture';
import { Input } from './Input';

const DEFAULT_CLEAR_LABEL = 'Clear';

export interface MenuBarSearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit?: (query: string) => void;
  placeholder: string;
  clearLabel?: string;
  className?: string;
}

const MenuBarSearchInput: React.FC<MenuBarSearchInputProps> = ({
  query,
  onQueryChange,
  onSubmit,
  placeholder,
  clearLabel = DEFAULT_CLEAR_LABEL,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const clearQuery = useCallback(() => onQueryChange(''), [onQueryChange]);

  useEscapeCapture(isFocused && query.length > 0, clearQuery);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

  const handleClear = () => {
    onQueryChange('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmed = query.trim();
      if (trimmed.length === 0) return;
      onSubmit?.(trimmed);
    }
  };

  const showClear = query.length > 0;

  return (
    <div className={cn('px-2 pb-2', className)}>
      <div className="relative w-full">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground/50"
        />
        <Input
          variant="default"
          type="text"
          role="searchbox"
          aria-label={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn('pl-9', showClear && 'pr-9')}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={clearLabel}
            title={clearLabel}
            className="absolute right-2 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/50 hover:bg-muted-background hover:text-foreground"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-3 w-3"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuBarSearchInput;
