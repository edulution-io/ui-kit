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
