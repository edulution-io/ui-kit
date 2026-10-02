/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type MenuBarConfigItem from '../components/MenuBarConfigItem';

export interface FilterMenuTreeResult {
  visibleItems: MenuBarConfigItem[];
  autoExpandIds: Set<string>;
}

const filterMenuTreeByQuery = (items: MenuBarConfigItem[], query: string): FilterMenuTreeResult => {
  const trimmed = query.trim().toLocaleLowerCase();
  if (!trimmed) return { visibleItems: items, autoExpandIds: new Set() };

  const autoExpandIds = new Set<string>();

  const walk = (item: MenuBarConfigItem): MenuBarConfigItem | null => {
    const selfMatches = item.label.toLocaleLowerCase().includes(trimmed);
    if (selfMatches) {
      return item;
    }
    const filteredChildren = (item.children ?? [])
      .map(walk)
      .filter((child): child is MenuBarConfigItem => child !== null);
    if (filteredChildren.length === 0) return null;
    autoExpandIds.add(item.id);
    return { ...item, children: filteredChildren };
  };

  const visibleItems = items.map(walk).filter((item): item is MenuBarConfigItem => item !== null);

  return { visibleItems, autoExpandIds };
};

export default filterMenuTreeByQuery;
