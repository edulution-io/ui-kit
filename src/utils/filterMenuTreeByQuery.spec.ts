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
import filterMenuTreeByQuery from './filterMenuTreeByQuery';

const noop = () => {};

const makeItem = (id: string, label: string, children?: MenuBarConfigItem[]): MenuBarConfigItem => ({
  id,
  label,
  action: noop,
  children,
});

describe('filterMenuTreeByQuery', () => {
  it('returns identity (same ref) when query is empty', () => {
    const items = [makeItem('a', 'Alpha'), makeItem('b', 'Beta')];
    const result = filterMenuTreeByQuery(items, '');
    expect(result.visibleItems).toBe(items);
    expect(result.autoExpandIds.size).toBe(0);
  });

  it('treats whitespace-only query as empty', () => {
    const items = [makeItem('a', 'Alpha')];
    const result = filterMenuTreeByQuery(items, '   ');
    expect(result.visibleItems).toBe(items);
    expect(result.autoExpandIds.size).toBe(0);
  });

  it('keeps a top-level node when its label matches, children untouched', () => {
    const children = [makeItem('a-1', 'Apple'), makeItem('a-2', 'Banana')];
    const items = [makeItem('a', 'Alpha', children), makeItem('b', 'Beta')];
    const result = filterMenuTreeByQuery(items, 'alp');
    expect(result.visibleItems).toHaveLength(1);
    expect(result.visibleItems[0].id).toBe('a');
    expect(result.visibleItems[0].children).toBe(children);
    expect(result.autoExpandIds.size).toBe(0);
  });

  it('filters out siblings when only a grandchild matches, marks ancestors auto-expand', () => {
    const grandchildren = [makeItem('g-1', 'Target'), makeItem('g-2', 'Other')];
    const child = makeItem('c-1', 'MiddleChild', grandchildren);
    const siblingChild = makeItem('c-2', 'SiblingChild');
    const root = makeItem('r', 'Root', [child, siblingChild]);
    const result = filterMenuTreeByQuery([root, makeItem('x', 'Xylophone')], 'target');

    expect(result.visibleItems).toHaveLength(1);
    expect(result.visibleItems[0].id).toBe('r');
    expect(result.visibleItems[0].children).toHaveLength(1);
    expect(result.visibleItems[0].children?.[0].id).toBe('c-1');
    expect(result.visibleItems[0].children?.[0].children).toHaveLength(1);
    expect(result.visibleItems[0].children?.[0].children?.[0].id).toBe('g-1');
    expect(result.autoExpandIds.has('r')).toBe(true);
    expect(result.autoExpandIds.has('c-1')).toBe(true);
    expect(result.autoExpandIds.has('g-1')).toBe(false);
  });

  it('returns empty when nothing matches', () => {
    const items = [makeItem('a', 'Alpha'), makeItem('b', 'Beta', [makeItem('b-1', 'Bravo')])];
    const result = filterMenuTreeByQuery(items, 'zzzzz');
    expect(result.visibleItems).toHaveLength(0);
    expect(result.autoExpandIds.size).toBe(0);
  });

  it('is case-insensitive both ways', () => {
    const items = [makeItem('a', 'AlphaZulu')];
    expect(filterMenuTreeByQuery(items, 'alphazulu').visibleItems).toHaveLength(1);
    expect(filterMenuTreeByQuery(items, 'ALPHAZULU').visibleItems).toHaveLength(1);
    expect(filterMenuTreeByQuery(items, 'AlPhAzUlU').visibleItems).toHaveLength(1);
  });

  it('matches substrings in the middle of labels', () => {
    const items = [makeItem('a', 'My Great Settings')];
    const result = filterMenuTreeByQuery(items, 'great');
    expect(result.visibleItems).toHaveLength(1);
  });

  it('trims leading/trailing whitespace in the query', () => {
    const items = [makeItem('a', 'Alpha')];
    const result = filterMenuTreeByQuery(items, '  alp  ');
    expect(result.visibleItems).toHaveLength(1);
  });

  it('does not mutate the original items array or nodes', () => {
    const child = makeItem('c-1', 'Child');
    const root = makeItem('r', 'Root', [child]);
    const items = [root];
    filterMenuTreeByQuery(items, 'child');
    expect(items).toHaveLength(1);
    expect(items[0]).toBe(root);
    expect(items[0].children).toHaveLength(1);
    expect(items[0].children?.[0]).toBe(child);
  });

  it('handles nodes without a children array', () => {
    const items = [makeItem('a', 'Alpha'), makeItem('b', 'Beta')];
    const result = filterMenuTreeByQuery(items, 'bet');
    expect(result.visibleItems).toHaveLength(1);
    expect(result.visibleItems[0].id).toBe('b');
  });

  it('keeps all children when self matches, even if children also match', () => {
    const children = [makeItem('c-1', 'Apple'), makeItem('c-2', 'Banana')];
    const items = [makeItem('a', 'Apple', children)];
    const result = filterMenuTreeByQuery(items, 'apple');
    expect(result.visibleItems[0].children).toBe(children);
    expect(result.autoExpandIds.size).toBe(0);
  });
});
