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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';
import useOnClickOutside from '../hooks/useOnClickOutside';
import buildActionMap from '../utils/buildActionMap';
import findInTree from '../utils/findInTree';
import findPathToNode from '../utils/findPathToNode';
import type MenuBarConfigItem from './MenuBarConfigItem';
import MenuBarLayout from './MenuBarLayout';
import MenuBarHeader from './MenuBarHeader';
import MenuBarItem from './MenuBarItem';
import MenuBarItemList from './MenuBarItemList';

const MOBILE_QUERY = '(max-width: 767px)';
const TABLET_QUERY = '(min-width: 768px) and (max-width: 1023px)';

const DEFAULT_COLLAPSE_LABEL = 'Collapse';
const DEFAULT_EXPAND_LABEL = 'Expand';

export interface MenuBarConfig {
  title: string;
  icon: React.ReactNode;
  color: string;
  onHeaderClick: () => void;
  items: MenuBarConfigItem[];
}

export type MenuBarProps = {
  config: MenuBarConfig;
  activeItemId: string;
  /**
   * Predicate evaluated against every child (at any depth) to determine which one is
   * currently active. The matching child is highlighted and its ancestors are
   * auto-expanded. Memoize with `useCallback` to avoid unnecessary re-walks.
   */
  isChildActive?: (item: MenuBarConfigItem) => boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  forceMobileLayout?: boolean;
  collapseLabel?: string;
  expandLabel?: string;
  footer?: React.ReactNode;
  className?: string;
  /**
   * Fires whenever a child (at any depth) is clicked, before its own `action` runs.
   * Use this to track the clicked child id at the parent level, e.g. for active-state
   * highlighting when the active child cannot be derived from the route alone.
   */
  onChildClick?: (childId: string) => void;
  /**
   * Maximum depth rendered as inline expandable accordions. Nodes deeper than this
   * switch to a drill-down view (tap to descend, back button to ascend). Defaults to 5.
   */
  maxDepth?: number;
  /**
   * Label for the drill-down back button shown when descending past `maxDepth`.
   * Pass a translated string. Defaults to `"Back"`.
   */
  backLabel?: string;
};

const getActiveColorClass = (color: string) => color.split(':')[1] ?? color;

const MenuBar: React.FC<MenuBarProps> = ({
  config,
  activeItemId,
  isChildActive,
  isOpen,
  onOpenChange,
  forceMobileLayout = false,
  collapseLabel = DEFAULT_COLLAPSE_LABEL,
  expandLabel = DEFAULT_EXPAND_LABEL,
  footer,
  className,
  onChildClick: onChildClickProp,
  maxDepth = 5,
  backLabel = 'Back',
}) => {
  const menuBarRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isTablet = useMediaQuery(TABLET_QUERY);
  const isDesktop = !isMobile && !isTablet && !forceMobileLayout;

  const activeChildId = useMemo(
    () => (isChildActive ? findInTree(config.items, isChildActive)?.id : undefined),
    [config.items, isChildActive],
  );

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    if (activeItemId) return new Set([activeItemId]);
    return new Set();
  });

  const configItemsRef = useRef(config.items);
  configItemsRef.current = config.items;

  useEffect(() => {
    const next = new Set<string>();
    if (activeItemId) next.add(activeItemId);
    if (activeChildId) {
      findPathToNode(configItemsRef.current, activeChildId).forEach((id) => next.add(id));
    }
    setExpandedItems(next);
  }, [activeItemId, activeChildId]);

  const toggleChildExpanded = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const topLevelIds = useMemo(() => new Set(config.items.map((item) => item.id)), [config.items]);

  const toggleTopLevelExpanded = useCallback(
    (itemId: string) => {
      setExpandedItems((prev) => {
        if (prev.has(itemId)) {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        }
        const next = new Set<string>();
        prev.forEach((id) => {
          if (!topLevelIds.has(id)) next.add(id);
        });
        next.add(itemId);
        return next;
      });
    },
    [topLevelIds],
  );

  const closeMobileMenu = useCallback(() => {
    if (!isDesktop) {
      onOpenChange(false);
    }
  }, [isDesktop, onOpenChange]);

  useOnClickOutside(menuBarRef, closeMobileMenu);

  const activeColorClass = getActiveColorClass(config.color);
  const actionMap = useMemo(() => buildActionMap(config.items), [config.items]);

  const handleItemClick = useCallback(
    (id: string) => {
      if (!isDesktop) {
        onOpenChange(false);
      }
      actionMap.get(id)?.();
    },
    [isDesktop, onOpenChange, actionMap],
  );

  const handleChildClick = useCallback(
    (childId: string) => {
      if (!isDesktop) {
        onOpenChange(false);
      }
      onChildClickProp?.(childId);
      actionMap.get(childId)?.();
    },
    [isDesktop, onOpenChange, onChildClickProp, actionMap],
  );

  return (
    <MenuBarLayout
      ref={menuBarRef}
      isDesktop={isDesktop}
      isOpen={isOpen}
      className={className}
    >
      <MenuBarHeader
        icon={config.icon}
        title={config.title}
        onHeaderClick={config.onHeaderClick}
      />

      <MenuBarItemList>
        {config.items.map((item) => {
          const isActive = activeItemId === item.id;
          return (
            <MenuBarItem
              key={item.id}
              itemId={item.id}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
              isExpanded={expandedItems.has(item.id)}
              activeColorClass={activeColorClass}
              collapseLabel={collapseLabel}
              expandLabel={expandLabel}
              childItems={item.children}
              activeChildId={activeChildId}
              expandedItems={expandedItems}
              onItemClick={() => handleItemClick(item.id)}
              onToggleExpand={() => toggleTopLevelExpanded(item.id)}
              onChildClick={handleChildClick}
              onToggleChildExpand={toggleChildExpanded}
              maxDepth={maxDepth}
              backLabel={backLabel}
            />
          );
        })}
      </MenuBarItemList>

      {footer}
    </MenuBarLayout>
  );
};

export default MenuBar;
