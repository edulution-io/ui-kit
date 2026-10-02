/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
