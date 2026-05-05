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
import { useCallback, useEffect, useRef, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
import { Input } from './Input';
import Checkbox from './Checkbox';

const SEARCH_DEBOUNCE_MS = 500;

/** Props for items rendered inside a CardList. */
export interface CardListItemProps<T> {
  /** The data item to render. */
  item: T;
  /** Whether this item is currently selected/active. */
  isActive: boolean;
  /** Whether this item's checkbox is checked (multi-select). */
  isChecked: boolean;
  /** Called when the item's checkbox state changes. */
  onCheckboxChange: () => void;
}

/** Configuration for the CardList header area. */
export interface CardListHeader {
  /** Title displayed in the header. */
  title?: string;
  /** Subtitle or count displayed below the title. */
  subtitle?: string;
  /** Additional content rendered to the right of the title (e.g. action buttons). */
  actions?: React.ReactNode;
}

/** Props for the CardList component. */
export interface CardListProps<T> {
  /** Array of items to display. */
  items: T[];
  /** Unique key extractor for each item. */
  keyExtractor: (item: T) => string | number;
  /** Render function for each item. Receives item data and interaction state. */
  renderItem: (props: CardListItemProps<T>) => React.ReactNode;
  /** Header configuration with title, subtitle, and action buttons. */
  header?: CardListHeader;
  /** Placeholder text for the search input. */
  searchPlaceholder?: string;
  /** Called with debounced search query when user types in the search input. */
  onSearch?: (query: string) => void;
  /** Search debounce delay in milliseconds. Defaults to 500ms. */
  searchDebounceMs?: number;
  /** Called when the user scrolls to the bottom of the list. Use for infinite scroll / pagination. */
  onLoadMore?: () => void;
  /** Whether more items are currently being loaded. Disables onLoadMore while true. */
  isLoading?: boolean;
  /** Whether all items have been loaded. Hides the infinite scroll sentinel when true. */
  hasMore?: boolean;
  /** Message displayed when items array is empty and isLoading is false. */
  emptyMessage?: string;
  /** Loading message displayed at the bottom of the list while isLoading is true. */
  loadingMessage?: string;
  /** The key/id of the currently active (selected) item. Compared against keyExtractor output. */
  activeItemKey?: string | number | null;
  /** Array of checked item keys for multi-select. */
  checkedItemKeys?: (string | number)[];
  /** Called when an item's checkbox state changes. */
  onItemCheckChange?: (key: string | number) => void;
  /** Called when select-all checkbox changes. */
  onSelectAll?: () => void;
  /** Called to clear all selections. */
  onClearSelection?: () => void;
  /** Content rendered in the bulk action bar. */
  bulkActions?: React.ReactNode;
  /** Renders the selection counter label. Receives the current checked count. Defaults to `${count} selected`. */
  selectionLabel?: (count: number) => string;
  /** Additional CSS class for the root container. */
  className?: string;
  /** Additional CSS class for the scroll container. */
  scrollClassName?: string;
}

/**
 * A generic, scrollable card list with built-in search, infinite scroll, and multi-select support.
 *
 * @example
 * ```tsx
 * <CardList
 *   items={messages}
 *   keyExtractor={(m) => m.uid}
 *   renderItem={({ item, isActive, onClick }) => (
 *     <div onClick={onClick} className={isActive ? 'bg-accent' : ''}>
 *       {item.subject}
 *     </div>
 *   )}
 *   header={{ title: 'INBOX', subtitle: '29 messages' }}
 *   searchPlaceholder="Search..."
 *   onSearch={setSearchQuery}
 *   onLoadMore={loadMore}
 *   hasMore={messages.length < total}
 *   isLoading={isLoading}
 *   emptyMessage="No items"
 * />
 * ```
 */
const CardList = <T,>({
  items,
  keyExtractor,
  renderItem,
  header,
  searchPlaceholder,
  onSearch,
  searchDebounceMs = SEARCH_DEBOUNCE_MS,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  emptyMessage,
  loadingMessage,
  activeItemKey,
  checkedItemKeys = [],
  onItemCheckChange,
  onSelectAll,
  onClearSelection,
  bulkActions,
  selectionLabel,
  className,
  scrollClassName,
}: CardListProps<T>) => {
  const [localSearch, setLocalSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setLocalSearch(value);

      if (onSearch) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onSearch(value);
        }, searchDebounceMs);
      }
    },
    [onSearch, searchDebounceMs],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !onLoadMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLoading, hasMore, onLoadMore]);

  const allChecked = items.length > 0 && checkedItemKeys.length === items.length;

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {header && (
        <div className="flex h-14 items-center justify-between border-b border-muted px-4">
          <div className="min-w-0 flex-1">
            {header.title && <h2 className="truncate text-base font-semibold text-foreground">{header.title}</h2>}
            {header.subtitle && <span className="text-xs text-muted-foreground">{header.subtitle}</span>}
          </div>
          {header.actions && <div className="ml-2 shrink-0">{header.actions}</div>}
        </div>
      )}

      {onSearch && (
        <div className="px-4 py-2">
          <Input
            value={localSearch}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            leftIcon={faSearch}
            onClear={() => {
              setLocalSearch('');
              onSearch('');
            }}
            className="h-9"
          />
        </div>
      )}

      {(bulkActions || onSelectAll) && (
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-muted pl-3 pr-4">
          {onSelectAll && (
            <Checkbox
              checked={allChecked}
              onCheckedChange={() => (allChecked ? onClearSelection?.() : onSelectAll())}
            />
          )}
          <span className="text-xs text-muted-foreground">
            {selectionLabel ? selectionLabel(checkedItemKeys.length) : `${checkedItemKeys.length} selected`}
          </span>
          {bulkActions && <div className="ml-auto">{bulkActions}</div>}
        </div>
      )}

      <div className={cn('relative flex-1 overflow-auto scrollbar-thin [scrollbar-gutter:stable]', scrollClassName)}>
        <div className="flex flex-col">
          {items.map((item) => {
            const key = keyExtractor(item);
            return (
              <React.Fragment key={key}>
                {renderItem({
                  item,
                  isActive: activeItemKey === key,
                  isChecked: checkedItemKeys.includes(key),
                  onCheckboxChange: () => onItemCheckChange?.(key),
                })}
              </React.Fragment>
            );
          })}

          {items.length === 0 && !isLoading && emptyMessage && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>
          )}

          {isLoading && loadingMessage && (
            <div className="px-4 py-4 text-center text-sm text-muted-foreground">{loadingMessage}</div>
          )}

          {onLoadMore && hasMore && (
            <div
              ref={sentinelRef}
              className="h-1"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardList;
