/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import safeGetHours from './safeGetHours';

describe('safeGetHours', () => {
  it('returns the hours of a Date input', () => {
    expect(safeGetHours(new Date(2026, 2, 15, 14, 30))).toBe(14);
  });

  it('returns 0 for non-Date input', () => {
    expect(safeGetHours(null)).toBe(0);
    expect(safeGetHours(undefined)).toBe(0);
    expect(safeGetHours('14:30')).toBe(0);
  });
});
