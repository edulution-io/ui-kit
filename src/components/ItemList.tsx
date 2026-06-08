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

import React from 'react';
import { ScrollArea } from './ScrollArea';

/** A single entry rendered by ItemList. */
export interface ListItem {
  /** Stable identifier used as the React key. */
  id: string;
  /** Display name rendered for the entry. */
  name: string;
}

/** Layout used by ItemList to render its items. */
export type ItemListLayout = 'list' | 'inline';

/** Props for the ItemList component. */
export interface ItemListProps {
  /** Items to render. When empty, ItemList renders nothing. */
  items: ListItem[];
  /**
   * Rendering layout.
   * - `'list'` (default): vertical scrollable list, with a single item rendered as a centered paragraph.
   * - `'inline'`: comma-separated paragraph that wraps within `max-w-[24rem]`.
   */
  layout?: ItemListLayout;
}

/**
 * A compact, recipe-aligned list of named items used in confirmation and warning dialogs.
 *
 * @example
 * ```tsx
 * <ItemList items={[{ id: 'a', name: 'file-a.txt' }, { id: 'b', name: 'file-b.txt' }]} />
 * <ItemList layout="inline" items={folderItems} />
 * ```
 */
const ItemList: React.FC<ItemListProps> = ({ items, layout = 'list' }) => {
  if (items.length === 0) return null;

  if (layout === 'inline') {
    return (
      <p className="mt-1 w-full max-w-[24rem] break-words text-sm font-medium">
        {items.map((item) => item.name).join(', ')}
      </p>
    );
  }

  if (items.length === 1) {
    return <p className="mt-4 font-medium">{items[0].name}</p>;
  }

  return (
    <ScrollArea className="mt-2 max-h-[218px] w-96 max-w-full overflow-y-auto rounded border p-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="truncate"
        >
          {item.name}
        </div>
      ))}
    </ScrollArea>
  );
};

export default ItemList;
