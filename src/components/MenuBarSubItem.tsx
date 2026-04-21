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
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
import { Button } from './Button';
import type MenuBarConfigItem from './MenuBarConfigItem';

interface MenuBarSubItemProps {
  item: MenuBarConfigItem;
  depth: number;
  activeChildId?: string | null;
  expandedItems?: Set<string>;
  onChildClick?: (childId: string) => void;
  onToggleChildExpand?: (childId: string) => void;
  collapseLabel: string;
  expandLabel: string;
  maxDepth: number;
  onDrillDown?: (itemId: string) => void;
}

const MenuBarSubItem: React.FC<MenuBarSubItemProps> = ({
  item,
  depth,
  activeChildId,
  expandedItems,
  onChildClick,
  onToggleChildExpand,
  collapseLabel,
  expandLabel,
  maxDepth,
  onDrillDown,
}) => {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const isExpanded = expandedItems?.has(item.id) ?? false;
  const isDrillDown = hasChildren && depth >= maxDepth;
  const paddingLeft = `${(depth + 1) * 0.5}rem`;
  const childrenId = `${item.id}-children`;

  const handleClick = () => {
    if (isDrillDown) {
      onDrillDown?.(item.id);
      return;
    }
    onChildClick?.(item.id);
    if (hasChildren && !isExpanded) {
      onToggleChildExpand?.(item.id);
    }
  };

  const inlineExpandLabel = isExpanded ? collapseLabel : expandLabel;
  const expandAriaLabel = isDrillDown ? item.label : inlineExpandLabel;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDrillDown) {
      onDrillDown?.(item.id);
      return;
    }
    onToggleChildExpand?.(item.id);
  };

  return (
    <>
      <div className={cn('flex w-full items-center', activeChildId === item.id && 'bg-accent')}>
        <Button
          type="button"
          variant="btn-ghost"
          onClick={handleClick}
          aria-expanded={!isDrillDown && hasChildren ? isExpanded : undefined}
          aria-controls={!isDrillDown && hasChildren ? childrenId : undefined}
          className={cn(
            'flex min-w-0 flex-1 items-center justify-start py-2 pr-3 font-normal',
            'transition-all duration-150',
            activeChildId === item.id && 'font-bold',
          )}
          style={{ paddingLeft }}
        >
          <span className="mr-2 w-4 shrink-0">{item.icon}</span>
          <span className="flex-1 truncate text-left">{item.label}</span>
        </Button>
        {hasChildren && (
          <Button
            type="button"
            variant="btn-ghost"
            onClick={handleExpandClick}
            aria-label={expandAriaLabel}
            className="p-1"
          >
            <FontAwesomeIcon
              icon={isDrillDown ? faChevronRight : faChevronDown}
              className={cn(
                'h-3 w-3 shrink-0 transition-transform duration-200',
                !isDrillDown && isExpanded && 'rotate-180',
              )}
            />
          </Button>
        )}
      </div>

      {hasChildren && !isDrillDown && (
        <div
          id={childrenId}
          role="region"
          aria-label={`${item.label} sections`}
          className={cn(
            'grid transition-all duration-200 ease-in-out',
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            {item.children?.map((child) => (
              <MenuBarSubItem
                key={child.id}
                item={child}
                depth={depth + 1}
                activeChildId={activeChildId}
                expandedItems={expandedItems}
                onChildClick={onChildClick}
                onToggleChildExpand={onToggleChildExpand}
                collapseLabel={collapseLabel}
                expandLabel={expandLabel}
                maxDepth={maxDepth}
                onDrillDown={onDrillDown}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MenuBarSubItem;
