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

import { describe, expect, it } from 'vitest';
import formatCountBadge, { COUNT_BADGE_MAX } from './formatCountBadge';

describe('formatCountBadge', () => {
  it('renders counts up to the max verbatim', () => {
    expect(formatCountBadge(0)).toBe('0');
    expect(formatCountBadge(10)).toBe('10');
    expect(formatCountBadge(COUNT_BADGE_MAX)).toBe(String(COUNT_BADGE_MAX));
  });

  it('clamps counts above the max to "<max>+"', () => {
    expect(formatCountBadge(COUNT_BADGE_MAX + 1)).toBe(`${COUNT_BADGE_MAX}+`);
    expect(formatCountBadge(247)).toBe('99+');
  });

  it('honours a custom max', () => {
    expect(formatCountBadge(9, 9)).toBe('9');
    expect(formatCountBadge(10, 9)).toBe('9+');
  });
});
