/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import type MenuBarConfigItem from '../components/MenuBarConfigItem';
import sumChildBadges from './sumChildBadges';

const item = (overrides: Partial<MenuBarConfigItem> & { id: string }): MenuBarConfigItem => ({
  label: overrides.id,
  action: () => {},
  ...overrides,
});

describe('sumChildBadges', () => {
  it('returns zero without items', () => {
    expect(sumChildBadges()).toBe(0);
    expect(sumChildBadges([])).toBe(0);
  });

  it('sums the badges of every descendant', () => {
    const items = [
      item({ id: 'inbox', badge: 3, children: [item({ id: 'inbox/important', badge: 5 })] }),
      item({ id: 'archive' }),
    ];
    expect(sumChildBadges(items)).toBe(8);
  });

  it('leaves out an item that opts out of the aggregation', () => {
    const items = [
      item({ id: 'inbox', badge: 5 }),
      item({ id: 'trash', badge: 7, excludeFromBadgeAggregation: true }),
      item({ id: 'junk', badge: 2, excludeFromBadgeAggregation: true }),
    ];
    expect(sumChildBadges(items)).toBe(5);
  });

  it('keeps counting the children of an item that opts out', () => {
    const items = [
      item({
        id: 'trash',
        badge: 7,
        excludeFromBadgeAggregation: true,
        children: [item({ id: 'trash/old', badge: 4 })],
      }),
    ];
    expect(sumChildBadges(items)).toBe(4);
  });

  it('keeps counting a nested item whose parent stays included', () => {
    const items = [
      item({
        id: 'account',
        children: [
          item({ id: 'account/inbox', badge: 6 }),
          item({ id: 'account/junk', badge: 9, excludeFromBadgeAggregation: true }),
        ],
      }),
    ];
    expect(sumChildBadges(items)).toBe(6);
  });
});
