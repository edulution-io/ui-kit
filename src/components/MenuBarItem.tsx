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
import { faChevronDown, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import findInTree from '../utils/findInTree';
import cn from '../utils/cn';
import { Button } from './Button';
import type MenuBarConfigItem from './MenuBarConfigItem';
import MenuBarSubItem from './MenuBarSubItem';

export type MenuBarItemProps = React.HTMLAttributes<HTMLDivElement> & {
  itemId: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  activeColorClass: string;
  collapseLabel: string;
  expandLabel: string;
  childItems?: MenuBarConfigItem[];
  activeChildId?: string | null;
  onItemClick: () => void;
  onToggleExpand: () => void;
  onChildClick?: (childId: string) => void;
  expandedItems?: Set<string>;
  onToggleChildExpand?: (childId: string) => void;
  maxDepth?: number;
  backLabel?: string;
};

const MenuBarItem = React.forwardRef<HTMLDivElement, MenuBarItemProps>(
  (
    {
      itemId,
      icon,
      label,
      isActive,
      isExpanded,
      activeColorClass,
      collapseLabel,
      expandLabel,
      childItems = [],
      activeChildId,
      onItemClick,
      onToggleExpand,
      onChildClick,
      expandedItems,
      onToggleChildExpand,
      maxDepth = 5,
      backLabel = 'Back',
      className,
      ...props
    },
    ref,
  ) => {
    const hasChildren = childItems.length > 0;
    const [drillDownStack, setDrillDownStack] = React.useState<string[]>([]);

    const handleDrillDown = React.useCallback((drillId: string) => {
      setDrillDownStack((prev) => [...prev, drillId]);
    }, []);

    const handleDrillUp = React.useCallback(() => {
      setDrillDownStack((prev) => prev.slice(0, -1));
    }, []);

    const drillDownItem = React.useMemo(() => {
      if (drillDownStack.length === 0) return undefined;
      let current: MenuBarConfigItem | undefined;
      drillDownStack.forEach((id) => {
        const searchIn = current?.children ?? childItems;
        current = findInTree(searchIn, (n) => n.id === id);
      });
      return current;
    }, [drillDownStack, childItems]);

    const handleItemClick = React.useCallback(() => {
      onItemClick();
      if (hasChildren && !isExpanded) {
        onToggleExpand();
      }
    }, [onItemClick, hasChildren, isExpanded, onToggleExpand]);

    const handleExpandClick = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleExpand();
      },
      [onToggleExpand],
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemClick();
        }
      },
      [handleItemClick],
    );

    const childrenId = `${itemId}-children`;

    const mainButton = (
      <div
        role="button"
        tabIndex={0}
        onClick={handleItemClick}
        onKeyDown={handleKeyDown}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-controls={hasChildren ? childrenId : undefined}
        aria-label={label}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 py-1 pl-3 pr-3 transition-colors hover:bg-muted-background',
          isActive ? activeColorClass : '',
        )}
      >
        {icon}
        <span className={cn('flex-1 text-left', isActive ? 'text-white' : '')}>{label}</span>
        {hasChildren && (
          <Button
            type="button"
            variant="btn-ghost"
            onClick={handleExpandClick}
            aria-label={isExpanded ? collapseLabel : expandLabel}
            className="p-1"
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={cn(
                'h-4 w-4 shrink-0 transition-transform duration-200',
                isActive && 'text-white',
                isExpanded && 'rotate-180',
              )}
            />
          </Button>
        )}
      </div>
    );

    const itemsToRender = drillDownItem?.children ?? childItems;

    const childrenContent = hasChildren && (
      <div
        id={childrenId}
        role="region"
        aria-label={`${label} sections`}
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="ml-2">
            {drillDownItem && (
              <>
                <Button
                  type="button"
                  variant="btn-ghost"
                  onClick={handleDrillUp}
                  className="flex w-full items-center gap-2 py-1 pl-2 pr-3 text-sm font-normal text-muted-foreground"
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="h-3 w-3"
                  />
                  <span>{backLabel}</span>
                </Button>
                <div className="py-1 pl-4 text-sm font-semibold">{drillDownItem.label}</div>
              </>
            )}
            {itemsToRender.map((child) => (
              <MenuBarSubItem
                key={child.id}
                item={child}
                depth={0}
                activeChildId={activeChildId}
                expandedItems={expandedItems}
                onChildClick={onChildClick}
                onToggleChildExpand={onToggleChildExpand}
                collapseLabel={collapseLabel}
                expandLabel={expandLabel}
                maxDepth={maxDepth}
                onDrillDown={handleDrillDown}
              />
            ))}
          </div>
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        className={className}
        {...props}
      >
        {mainButton}
        {childrenContent}
      </div>
    );
  },
);

MenuBarItem.displayName = 'MenuBarItem';

export default MenuBarItem;
