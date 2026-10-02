/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import buildActionMap from './buildActionMap';

describe('buildActionMap', () => {
  it('maps top-level items by id', () => {
    const action1 = vi.fn();
    const action2 = vi.fn();
    const items = [
      { id: 'a', action: action1 },
      { id: 'b', action: action2 },
    ];
    const map = buildActionMap(items);
    expect(map.get('a')).toBe(action1);
    expect(map.get('b')).toBe(action2);
  });

  it('includes deeply nested children', () => {
    const leaf = vi.fn();
    const items = [
      {
        id: 'root',
        action: vi.fn(),
        children: [
          {
            id: 'child',
            action: vi.fn(),
            children: [{ id: 'grandchild', action: leaf }],
          },
        ],
      },
    ];
    const map = buildActionMap(items);
    expect(map.get('grandchild')).toBe(leaf);
  });

  it('returns empty map for empty array', () => {
    expect(buildActionMap([]).size).toBe(0);
  });
});
