/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import safeGetDate from './safeGetDate';

describe('safeGetDate', () => {
  it('returns a fresh copy of a Date input without mutating the original', () => {
    const original = new Date(2026, 2, 15, 8, 30);
    const result = safeGetDate(original);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(original.getTime());
    expect(result).not.toBe(original);
  });

  it('falls back to the current date for non-Date input', () => {
    expect(safeGetDate(null)).toBeInstanceOf(Date);
    expect(safeGetDate(undefined)).toBeInstanceOf(Date);
    expect(safeGetDate('2026-03-15')).toBeInstanceOf(Date);
  });
});
