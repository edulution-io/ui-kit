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
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import findInTree from '../utils/findInTree';
import cn from '../utils/cn';
import sumChildBadges from '../utils/sumChildBadges';
import { Button } from './Button';
import type MenuBarConfigItem from './MenuBarConfigItem';
import type MenuBarDropData from './MenuBarDropData';
import MenuBarSubItem from './MenuBarSubItem';

const SPRING_LOAD_EXPAND_DELAY_MS = 600;

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
  aggregateChildBadges?: boolean;
  dropData?: MenuBarDropData;
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
      aggregateChildBadges = false,
      dropData,
      className,
      ...props
    },
    ref,
  ) => {
    const hasChildren = childItems.length > 0;
    const aggregatedBadge = React.useMemo(
      () => (aggregateChildBadges ? sumChildBadges(childItems) : 0),
      [aggregateChildBadges, childItems],
    );
    const showAggregatedBadge = aggregateChildBadges && aggregatedBadge > 0;
    const [drillDownStack, setDrillDownStack] = React.useState<string[]>([]);

    const droppableDisabled = !dropData && !hasChildren;
    const { setNodeRef: setDropRef, isOver } = useDroppable({
      id: `${itemId}-drop`,
      data: dropData,
      disabled: droppableDisabled,
    });
    const isActiveDropTarget = !!dropData && isOver;

    const { active } = useDndContext();
    const isDragActive = active != null;

    const canSpringLoadOpen = hasChildren && !isExpanded;
    const onToggleExpandRef = React.useRef(onToggleExpand);
    onToggleExpandRef.current = onToggleExpand;
    React.useEffect(() => {
      if (!isOver || !canSpringLoadOpen) return undefined;
      const timer = setTimeout(() => onToggleExpandRef.current(), SPRING_LOAD_EXPAND_DELAY_MS);
      return () => clearTimeout(timer);
    }, [isOver, canSpringLoadOpen]);

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
        ref={setDropRef}
        role="button"
        tabIndex={0}
        onClick={handleItemClick}
        onKeyDown={handleKeyDown}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-controls={hasChildren ? childrenId : undefined}
        aria-label={label}
        className={cn(
          'relative flex w-full cursor-pointer items-center gap-3 rounded-lg py-2 pl-3 pr-3 text-foreground outline-none transition-colors',
          'before:absolute before:bottom-1 before:left-0 before:top-1 before:w-[3px] before:rounded-r before:bg-primary before:opacity-0 before:transition-opacity before:content-[""]',
          'hover:bg-accent/50 hover:before:opacity-100',
          'focus-visible:bg-accent/50 focus-visible:before:opacity-100',
          isActive && cn(activeColorClass, 'text-primary-foreground before:opacity-100'),
          isActiveDropTarget && 'bg-primary/20 outline outline-2 -outline-offset-2 outline-primary',
        )}
      >
        {icon}
        <span className={cn('min-w-0 flex-1 truncate text-left text-base', isActive ? 'text-primary-foreground' : '')}>
          {label}
        </span>
        {showAggregatedBadge && (
          <span
            aria-label={`${aggregatedBadge} unread`}
            className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium tabular-nums leading-none text-foreground dark:text-primary-foreground"
          >
            {aggregatedBadge > 99 ? '99+' : aggregatedBadge}
          </span>
        )}
        {hasChildren && (
          <Button
            type="button"
            variant="btn-ghost"
            onClick={handleExpandClick}
            aria-label={isExpanded ? collapseLabel : expandLabel}
            className="shrink-0 p-1"
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={cn(
                'h-4 w-4 shrink-0 transition-transform duration-200',
                isActive && 'text-primary-foreground',
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
          'grid',
          !isDragActive && 'transition-all duration-200 ease-in-out',
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
                aggregateChildBadges={aggregateChildBadges}
                isVisible={isExpanded}
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
