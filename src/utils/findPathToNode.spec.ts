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

import findPathToNode from './findPathToNode';

describe('findPathToNode', () => {
  const items = [
    {
      id: 'a',
      children: [
        {
          id: 'b',
          children: [{ id: 'c' }, { id: 'd' }],
        },
        { id: 'e' },
      ],
    },
    { id: 'f' },
  ];

  it('returns path from root to target', () => {
    expect(findPathToNode(items, 'c')).toEqual(['a', 'b', 'c']);
  });

  it('returns single-element array for top-level match', () => {
    expect(findPathToNode(items, 'f')).toEqual(['f']);
  });

  it('returns empty array when target not found', () => {
    expect(findPathToNode(items, 'missing')).toEqual([]);
  });

  it('finds sibling at same depth', () => {
    expect(findPathToNode(items, 'd')).toEqual(['a', 'b', 'd']);
  });

  it('finds item at depth 1', () => {
    expect(findPathToNode(items, 'e')).toEqual(['a', 'e']);
  });
});
