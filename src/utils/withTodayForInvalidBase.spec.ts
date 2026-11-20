/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import withTodayForInvalidBase from './withTodayForInvalidBase';

const NOW = new Date('2025-07-01T02:00:00.000Z');
const NEW_YORK = 'America/New_York';

describe('withTodayForInvalidBase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds the date of today to a time-only patch on an invalid base', () => {
    const today = new Date();

    expect(withTodayForInvalidBase(new Date(Number.NaN), { hour: 10 })).toEqual({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      hour: 10,
    });
  });

  it('adds the date of today in the given zone', () => {
    expect(withTodayForInvalidBase(new Date(Number.NaN), { minute: 15 }, NEW_YORK)).toEqual({
      year: 2025,
      month: 6,
      day: 30,
      minute: 15,
    });
  });

  it('leaves a patch that already carries a date unchanged', () => {
    const patch = { year: 2025, month: 3, day: 30, hour: 10 };

    expect(withTodayForInvalidBase(new Date(Number.NaN), patch, NEW_YORK)).toBe(patch);
  });

  it('leaves the patch unchanged for a valid base and for no base', () => {
    const patch = { hour: 10 };

    expect(withTodayForInvalidBase(new Date(2025, 2, 30), patch)).toBe(patch);
    expect(withTodayForInvalidBase(null, patch)).toBe(patch);
  });
});
