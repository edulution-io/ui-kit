/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import isValidDate from './isValidDate';

describe('isValidDate', () => {
  it('accepts a Date with a time value', () => {
    expect(isValidDate(new Date(2025, 2, 30))).toBe(true);
  });

  it('rejects an invalid Date', () => {
    expect(isValidDate(new Date(Number.NaN))).toBe(false);
  });

  it('rejects values that are not a Date', () => {
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
    expect(isValidDate('2025-03-30')).toBe(false);
    expect(isValidDate(Date.now())).toBe(false);
  });
});
