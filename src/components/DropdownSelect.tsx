/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from '../utils/cn';
import useEscapeCapture from '../hooks/useEscapeCapture';
import { INPUT_BASE_CLASSES, VARIANT_COLORS } from '../constants/inputClassNames';

const DROPDOWN_SELECT_CLASSES = `${INPUT_BASE_CLASSES} box-border truncate !pl-2.5 !pr-8 text-start placeholder:text-foreground`;

export type DropdownVariant = 'dialog' | 'default';

export type DropdownOptions = {
  id: string;
  name: string;
  disabled?: boolean;
};

const DEFAULT_SEARCH_FROM_OPTION_COUNT = 4;

export interface DropdownSelectProps {
  options: DropdownOptions[];
  selectedVal: string;
  handleChange: (value: string) => void;
  openToTop?: boolean;
  classname?: string;
  inputClassName?: string;
  menuClassName?: string;
  variant?: DropdownVariant;
  placeholder?: string;
  ariaLabel?: string;
  enableSearch?: boolean;
  searchFromOptionCount?: number;
  enablePortalUsage?: boolean;
  noResultsText?: string;
  renderLabel?: (name: string) => string;
  renderOption?: (option: DropdownOptions, label: string) => React.ReactNode;
  groupOf?: (option: DropdownOptions) => string | undefined;
  maxMenuHeight?: number;
}

const OPTION_ROW_HEIGHT = 38.5;
const VISIBLE_OPTION_ROWS = 3.5;
const MENU_MAX_HEIGHT = OPTION_ROW_HEIGHT * VISIBLE_OPTION_ROWS;
const MENU_MARGIN = 2;

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  selectedVal,
  handleChange,
  openToTop: openToTopProp = false,
  classname,
  inputClassName,
  menuClassName,
  variant = 'default',
  placeholder = '',
  ariaLabel,
  enableSearch = true,
  searchFromOptionCount = DEFAULT_SEARCH_FROM_OPTION_COUNT,
  enablePortalUsage = true,
  noResultsText = 'No results',
  renderLabel = (name: string) => name,
  renderOption,
  groupOf,
  maxMenuHeight,
}: DropdownSelectProps) => {
  const searchEnabled = enableSearch && options.length >= searchFromOptionCount;
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [openToTop, setOpenToTop] = useState(openToTopProp);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const resolvedMaxHeight = maxMenuHeight ?? MENU_MAX_HEIGHT;

  const calculatePosition = useCallback(() => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldOpenToTop = openToTopProp || (spaceBelow < resolvedMaxHeight + MENU_MARGIN && spaceAbove > spaceBelow);
    setOpenToTop(shouldOpenToTop);

    if (!enablePortalUsage) {
      setMenuPosition({ top: 0, left: 0, width: rect.width });
      return;
    }

    const menuHeight = Math.min(menuRef.current?.scrollHeight ?? resolvedMaxHeight, resolvedMaxHeight);
    const viewportOffsetTop = window.visualViewport?.offsetTop ?? 0;
    const calculatedTop = shouldOpenToTop
      ? rect.top - menuHeight - MENU_MARGIN + viewportOffsetTop
      : rect.bottom + MENU_MARGIN + viewportOffsetTop;

    setMenuPosition({
      top: calculatedTop,
      left: rect.left,
      width: rect.width,
    });
  }, [openToTopProp, resolvedMaxHeight, enablePortalUsage]);

  useEffect(() => {
    if (!isOpen) return undefined;

    let requestAnimationFrameId: number;

    const updatePosition = () => {
      calculatePosition();
      requestAnimationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);

      if (isOutsideDropdown && isOutsideMenu) {
        closeMenu();
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen]);

  const closeMenuOnEscape = () => {
    const focused = document.activeElement;
    const focusWasInside =
      Boolean(dropdownRef.current?.contains(focused)) || Boolean(menuRef.current?.contains(focused));
    closeMenu();
    if (focusWasInside) inputRef.current?.focus();
  };

  useEscapeCapture(isOpen, closeMenuOnEscape);

  const selectedOption = options.find((o) => o.id === selectedVal);
  const selectedLabel = selectedOption ? renderLabel(selectedOption.name) : '';

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((option) => renderLabel(option.name).toLowerCase().includes(q));
  }, [options, query, renderLabel]);

  const collapseDisplaySelection = (event: React.FocusEvent<HTMLInputElement>) => {
    if (searchEnabled) return;
    const input = event.currentTarget;
    queueMicrotask(() => {
      if (input.selectionStart !== input.selectionEnd) input.setSelectionRange(0, 0);
    });
  };

  const openMenu = () => setIsOpen(true);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocused = event.relatedTarget as Node | null;
    if (!nextFocused) return;

    const staysInside =
      Boolean(dropdownRef.current?.contains(nextFocused)) || Boolean(menuRef.current?.contains(nextFocused));
    if (!staysInside) closeMenu();
  };

  const selectOption = (option: DropdownOptions) => {
    handleChange(option.id);
    closeMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent, option: DropdownOptions) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectOption(option);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.currentTarget.scrollTop += e.deltaY;
  };

  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const deltaY = touchStartY.current - e.touches[0].clientY;
    e.currentTarget.scrollTop += deltaY;
    touchStartY.current = e.touches[0].clientY;
  };

  const arrowPointsDown = (isOpen && !openToTop) || (!isOpen && openToTop);

  const variantClasses = {
    default: VARIANT_COLORS.default,
    dialog: VARIANT_COLORS.dialog,
  };

  const panelVariantClasses = {
    default: 'liquid-glass-panel text-foreground',
    dialog: 'liquid-glass-panel text-foreground',
  };

  const optionVariantClasses = {
    default: {
      base: 'hover:bg-muted',
      selected: 'bg-muted',
    },
    dialog: {
      base: 'hover:bg-muted-light',
      selected: 'bg-muted-light',
    },
  };

  const renderOptionRow = (option: DropdownOptions) => {
    const label = renderLabel(option.name);
    const selected = option.id === selectedVal;
    const classes = optionVariantClasses[variant];

    return (
      <div
        key={option.id}
        role="option"
        aria-selected={selected}
        aria-disabled={option.disabled || undefined}
        aria-label={label}
        tabIndex={option.disabled ? -1 : 0}
        onClick={option.disabled ? undefined : () => selectOption(option)}
        onKeyDown={option.disabled ? undefined : (e) => handleKeyDown(e, option)}
        className={cn(
          'box-border block px-2.5 py-2',
          option.disabled
            ? 'cursor-not-allowed opacity-50'
            : cn('cursor-pointer', selected ? classes.selected : classes.base),
        )}
        title={label}
      >
        {renderOption ? renderOption(option, label) : label}
      </div>
    );
  };

  const toGroupRuns = (optionsToGroup: DropdownOptions[]) =>
    optionsToGroup.reduce<{ group: string | undefined; options: DropdownOptions[] }[]>((runs, option) => {
      const group = groupOf?.(option);
      const openRun = runs.at(-1);

      if (openRun && openRun.group === group) {
        openRun.options.push(option);
        return runs;
      }

      runs.push({ group, options: [option] });
      return runs;
    }, []);

  const renderPanel = () => {
    const panelStyle: React.CSSProperties = enablePortalUsage
      ? { maxHeight: resolvedMaxHeight, top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }
      : { maxHeight: resolvedMaxHeight, width: Math.max(menuPosition.width, 150) };

    return (
      <div
        ref={menuRef}
        className={cn(
          'pointer-events-auto z-[1000] box-border touch-pan-y overflow-y-auto rounded-lg text-p scrollbar-thin',
          enablePortalUsage ? 'fixed' : cn('absolute left-0', openToTop ? 'bottom-full mb-0.5' : 'top-full mt-0.5'),
          panelVariantClasses[variant],
          menuClassName,
        )}
        style={panelStyle}
        role="listbox"
        id={listboxId}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {toGroupRuns(filteredOptions).map((run, runIndex) => {
          const rows = run.options.map((option) => renderOptionRow(option));

          if (!run.group) return <React.Fragment key={run.options[0].id}>{rows}</React.Fragment>;

          const headingId = `${listboxId}-group-${runIndex}`;

          return (
            <div
              key={run.options[0].id}
              role="group"
              aria-labelledby={headingId}
            >
              <div
                id={headingId}
                role="presentation"
                className={cn(
                  'box-border block truncate px-2.5 py-1.5 text-xs font-medium text-muted-foreground',
                  runIndex > 0 && 'mt-1 border-t border-accent-light pt-2',
                )}
                title={run.group}
              >
                {run.group}
              </div>
              {rows}
            </div>
          );
        })}
        {filteredOptions.length === 0 && (
          <div
            className="box-border block cursor-default px-2.5 py-2"
            aria-disabled="true"
          >
            {noResultsText}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn('relative cursor-default', classname)}
      ref={dropdownRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      onBlur={handleBlur}
    >
      <input
        ref={inputRef}
        type="text"
        name={searchEnabled ? 'searchTerm' : undefined}
        value={searchEnabled ? query : selectedLabel || placeholder}
        placeholder={searchEnabled ? selectedLabel || placeholder : undefined}
        onChange={searchEnabled ? handleSearchChange : undefined}
        onClick={openMenu}
        onFocus={collapseDisplaySelection}
        readOnly={!searchEnabled}
        disabled={options.length === 0}
        aria-label={ariaLabel}
        className={cn(
          DROPDOWN_SELECT_CLASSES,
          variantClasses[variant],
          {
            'cursor-text': searchEnabled,
            'cursor-pointer': !searchEnabled,
          },
          inputClassName,
        )}
        aria-autocomplete={searchEnabled ? 'list' : undefined}
        aria-controls={listboxId}
      />

      <div
        className={cn(
          'pointer-events-none absolute right-2.5 top-1/2 block h-0 w-0 -translate-y-1/2 border-solid border-border',
          {
            'border-x-[5px] border-b-0 border-t-[5px] border-x-transparent': !arrowPointsDown,
            'border-x-[5px] border-b-[5px] border-t-0 border-x-transparent': arrowPointsDown,
          },
        )}
      />

      {isOpen && (enablePortalUsage ? createPortal(renderPanel(), document.body) : renderPanel())}
    </div>
  );
};

export default DropdownSelect;
