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
