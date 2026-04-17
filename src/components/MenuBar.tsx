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
import useMediaQuery from '../hooks/useMediaQuery';
import useOnClickOutside from '../hooks/useOnClickOutside';
import MenuBarLayout from './MenuBarLayout';
import MenuBarHeader from './MenuBarHeader';
import MenuBarItem from './MenuBarItem';
import MenuBarItemList from './MenuBarItemList';

const MOBILE_QUERY = '(max-width: 767px)';
const TABLET_QUERY = '(min-width: 768px) and (max-width: 1023px)';

const DEFAULT_COLLAPSE_LABEL = 'Collapse';
const DEFAULT_EXPAND_LABEL = 'Expand';

export interface MenuBarConfigChildItem {
  id: string;
  label: string;
  action: () => void;
}

export interface MenuBarConfigItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  children?: MenuBarConfigChildItem[];
}

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
  activeChildId?: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  forceMobileLayout?: boolean;
  collapseLabel?: string;
  expandLabel?: string;
  footer?: React.ReactNode;
  className?: string;
};

const getActiveColorClass = (color: string) => color.split(':')[1] ?? color;

const MenuBar: React.FC<MenuBarProps> = ({
  config,
  activeItemId,
  activeChildId,
  isOpen,
  onOpenChange,
  forceMobileLayout = false,
  collapseLabel = DEFAULT_COLLAPSE_LABEL,
  expandLabel = DEFAULT_EXPAND_LABEL,
  footer,
  className,
}) => {
  const menuBarRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isTablet = useMediaQuery(TABLET_QUERY);
  const isDesktop = !isMobile && !isTablet && !forceMobileLayout;

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    if (activeItemId) return new Set([activeItemId]);
    return new Set();
  });

  useEffect(() => {
    if (activeItemId) {
      setExpandedItems((prev) => {
        if (prev.has(activeItemId)) return prev;
        return new Set(prev).add(activeItemId);
      });
    }
  }, [activeItemId]);

  const toggleExpanded = useCallback((itemId: string) => {
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

  const closeMobileMenu = useCallback(() => {
    if (!isDesktop) {
      onOpenChange(false);
    }
  }, [isDesktop, onOpenChange]);

  useOnClickOutside(menuBarRef, closeMobileMenu);

  const activeColorClass = getActiveColorClass(config.color);

  const handleItemClick = useCallback(
    (itemId: string) => {
      if (!isDesktop) {
        onOpenChange(false);
      }
      const item = config.items.find((i) => i.id === itemId);
      item?.action();
    },
    [isDesktop, onOpenChange, config.items],
  );

  const handleChildClick = useCallback(
    (itemId: string, childId: string) => {
      if (!isDesktop) {
        onOpenChange(false);
      }
      const item = config.items.find((i) => i.id === itemId);
      const child = item?.children?.find((c) => c.id === childId);
      child?.action();
    },
    [isDesktop, onOpenChange, config.items],
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
              childItems={item.children?.map((child) => ({ id: child.id, label: child.label }))}
              activeChildId={activeChildId}
              onItemClick={() => handleItemClick(item.id)}
              onToggleExpand={() => toggleExpanded(item.id)}
              onChildClick={(childId) => handleChildClick(item.id, childId)}
            />
          );
        })}
      </MenuBarItemList>

      {footer}
    </MenuBarLayout>
  );
};

export default MenuBar;
