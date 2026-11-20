/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import toDisplayMonth from './toDisplayMonth';

const NOW = new Date('2025-07-01T02:00:00.000Z');

describe('toDisplayMonth', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the calendar day of a valid value in the given zone', () => {
    const displayMonth = toDisplayMonth(new Date('2025-03-30T03:30:00.000Z'), 'America/New_York');

    expect(displayMonth.getTime()).toBe(new Date(2025, 2, 29).getTime());
  });

  it('returns a copy of a valid value without a zone', () => {
    const value = new Date(2025, 2, 30, 5, 30);
    const displayMonth = toDisplayMonth(value);

    expect(displayMonth).not.toBe(value);
    expect(displayMonth.getTime()).toBe(value.getTime());
  });

  it('falls back to now for an invalid Date', () => {
    expect(toDisplayMonth(new Date(Number.NaN)).getTime()).toBe(NOW.getTime());
  });

  it('falls back to today in the given zone for an invalid Date', () => {
    const displayMonth = toDisplayMonth(new Date(Number.NaN), 'America/New_York');

    expect(displayMonth.getTime()).toBe(new Date(2025, 5, 30).getTime());
  });

  it('falls back to now for a value that is not a Date', () => {
    expect(toDisplayMonth(null).getTime()).toBe(NOW.getTime());
    expect(toDisplayMonth('2025-03-30').getTime()).toBe(NOW.getTime());
  });
});
