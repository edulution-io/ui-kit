/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import findInTree from './findInTree';

describe('findInTree', () => {
  const items = [{ id: 'a', children: [{ id: 'b', children: [{ id: 'c' }] }] }, { id: 'd' }];

  it('finds a deeply nested node by predicate', () => {
    expect(findInTree(items, (n) => n.id === 'c')?.id).toBe('c');
  });

  it('finds a top-level node', () => {
    expect(findInTree(items, (n) => n.id === 'd')?.id).toBe('d');
  });

  it('returns undefined when not found', () => {
    expect(findInTree(items, (n) => n.id === 'z')).toBeUndefined();
  });

  it('returns undefined for undefined input', () => {
    expect(findInTree(undefined, () => true)).toBeUndefined();
  });
});
