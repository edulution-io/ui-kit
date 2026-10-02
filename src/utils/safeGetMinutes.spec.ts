/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import safeGetMinutes from './safeGetMinutes';

describe('safeGetMinutes', () => {
  it('returns the minutes of a Date input', () => {
    expect(safeGetMinutes(new Date(2026, 2, 15, 14, 30))).toBe(30);
  });

  it('returns 0 for non-Date input', () => {
    expect(safeGetMinutes(null)).toBe(0);
    expect(safeGetMinutes(undefined)).toBe(0);
    expect(safeGetMinutes('14:30')).toBe(0);
  });
});
