/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import toCalendarDay from './toCalendarDay';

describe('toCalendarDay', () => {
  it('returns the browser-local midnight of the day the instant falls on in the given zone', () => {
    const calendarDay = toCalendarDay(new Date('2025-03-30T03:30:00.000Z'), 'America/New_York');

    expect(calendarDay.getTime()).toBe(new Date(2025, 2, 29).getTime());
  });

  it('returns a copy of the date without a zone', () => {
    const date = new Date(2025, 2, 30, 5, 30);
    const calendarDay = toCalendarDay(date);

    expect(calendarDay).not.toBe(date);
    expect(calendarDay.getTime()).toBe(date.getTime());
  });

  describe('in a browser zone whose DST gap ends at midnight', () => {
    const originalTimeZone = process.env.TZ;

    beforeAll(() => {
      process.env.TZ = 'America/Nuuk';
    });

    afterAll(() => {
      process.env.TZ = originalTimeZone;
    });

    it('runs under a browser zone that skips 23:00-24:00 on the transition Saturday', () => {
      expect(new Date(2026, 2, 28, 23, 30).getDate()).toBe(29);
    });

    it('keeps the day when the browser time of day falls into that gap on the zone day', () => {
      const calendarDay = toCalendarDay(new Date('2026-03-28T01:30:00.000Z'), 'UTC');

      expect(calendarDay.getTime()).toBe(new Date(2026, 2, 28).getTime());
    });
  });
});
