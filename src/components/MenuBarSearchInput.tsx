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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

  const handleClear = () => {
    onQueryChange('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();
      if (query.length > 0) onQueryChange('');
      return;
    }
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
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          variant="default"
          type="text"
          role="searchbox"
          aria-label={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn('pl-9', showClear && 'pr-9')}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={clearLabel}
            title={clearLabel}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted-background"
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
