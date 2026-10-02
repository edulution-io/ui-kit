/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
